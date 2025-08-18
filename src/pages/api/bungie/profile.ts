import type {
	DestinyCharacterComponent,
	DestinyCurrenciesComponent,
	DestinyInventoryComponent,
	DestinyPlatformSilverComponent,
	DestinyProfileComponent,
} from "bungie-api-ts/destiny2";
import type { GroupMembership } from "bungie-api-ts/groupv2";
import type { NextApiRequest, NextApiResponse } from "next";

import {
	AuthError,
	fetchUserProfileFromBungie,
} from "@/utils/bungieApi/destiny2-api-server";

export type ProfileResponse = {
	characters: {
		[key: string]: DestinyCharacterComponent;
	};
	profile: DestinyProfileComponent;
	inventories?: DestinyInventoryComponent;
	currencies?: DestinyCurrenciesComponent;
	silver?: DestinyPlatformSilverComponent;
	clan?: GroupMembership;
	error?: AuthError;
};

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ProfileResponse>,
) => {
	switch (req.method) {
		case "GET": {
			try {
				if (
					!req.cookies.destinyLauncherLoggedIn ||
					req.cookies.destinyLauncherLoggedIn !== "1" ||
					!req.cookies.membershipId
				) {
					res.status(403).end();
					return;
				}
				const { user, clan } = await fetchUserProfileFromBungie(
					req.cookies.membershipId,
					req.cookies.accessToken, // Pass the access token from the cookie
				);

				if (!user.profile.data || !user.characters.data) {
					throw new Error("No data inside fetched profile");
				}

				const data: ProfileResponse = {
					characters: user.characters.data,
					profile: user.profile.data,
					inventories: user.profileInventory.data,
					currencies: user.profileCurrencies.data as
						| DestinyCurrenciesComponent
						| undefined,
					silver: user.platformSilver.data,
					clan: clan.totalResults > 0 ? clan.results[0] : undefined,
				};

				res.status(200).json(data);
				return;
			} catch (error: unknown) {
				console.error(error);
				if (error instanceof Error && error.name === "AuthError") {
					console.error("AuthError");
					res.redirect("/api/auth/refresh");
					res.status(403).end();
					return;
				}
				res.status(403).json({
					characters: undefined as never,
					profile: undefined as never,
					inventories: undefined as never,
					currencies: undefined as never,
					error: error instanceof Error ? error : new Error(String(error)),
				});
				return;
			}
		}

		default: {
			res.setHeader("Allow", "GET");
			res.status(405).end();
			return;
		}
	}
};
