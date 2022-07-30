import type {
	DestinyCharacterComponent,
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
					!req.cookies.accessToken
				) {
					return res.status(403).end();
				}
				const { user, clan } = await fetchUserProfileFromBungie(
					req.cookies.accessToken,
				);
				if (!user.profile.data || !user.characters.data) {
					throw new Error("No data inside fetched profile");
				}

				const data = {
					characters: user.characters.data,
					profile: user.profile.data,
					clan: clan && clan.totalResults > 0 ? clan.results[0] : undefined,
				};

				return res.status(200).json(data);
			} catch (error: any) {
				console.error(error);
				if (error.name === "AuthError") {
					console.log("red");
					return res.redirect("/api/auth/refresh");
					return res.status(403).json({
						characters: undefined as never,
						profile: undefined as never,
						error,
					});
				}
				return res.status(401).end();
			}
		}

		default: {
			res.setHeader("Allow", "GET");
			return res.status(405).end();
		}
	}
};
