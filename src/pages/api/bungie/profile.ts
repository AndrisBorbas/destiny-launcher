import type {
	DestinyCharacterComponent,
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
	currencies?: DestinyInventoryComponent;
	silver?: DestinyPlatformSilverComponent;
	characterInventories?: {
		[key: string]: DestinyInventoryComponent;
	};
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

				// If we don't have an access token, this is likely an expired session
				if (!req.cookies.accessToken) {
					console.error("No access token available - session may be expired");
					res.status(401).json({
						characters: undefined as never,
						profile: undefined as never,
						inventories: undefined as never,
						currencies: undefined as never,
						error: new AuthError(
							"No access token available - session may be expired",
						),
					});
					return;
				}

				const { user, clan } = await fetchUserProfileFromBungie(
					req.cookies.membershipId,
					req.cookies.accessToken, // Pass the access token from the cookie
				);

				if (!user.profile.data || !user.characters.data) {
					throw new Error("No data inside fetched profile");
				}

				// Check if we actually got private data by verifying we have inventory data
				// or other private components that require authentication
				if (!user.profileInventory.data && !user.profileCurrencies.data) {
					// This suggests the token might be expired and we're only getting public data
					console.error(
						"Failed to retrieve private profile data - token may be expired",
					);
					res.status(401).json({
						characters: undefined as never,
						profile: undefined as never,
						error: new AuthError(
							"Failed to retrieve private profile data - token may be expired",
						),
					});
					return;
				}

				const data: ProfileResponse = {
					characters: user.characters.data,
					profile: user.profile.data,
					inventories: user.profileInventory.data,
					currencies: user.profileCurrencies.data,
					silver: user.platformSilver.data,
					clan: clan.totalResults > 0 ? clan.results[0] : undefined,
					characterInventories: user.characterInventories.data,
				};

				res.status(200).json(data);
				return;
			} catch (error: unknown) {
				// Check if this is specifically an auth error from fetchUserProfileFromBungie
				if (
					error instanceof AuthError ||
					(error instanceof Error && error.message.includes("token")) ||
					(error instanceof Error && error.message.includes("401")) ||
					(error instanceof Error && error.message.includes("unauthorized"))
				) {
					console.error("Authentication failed, token refresh needed:", error);
					res.status(401).json({
						characters: undefined as never,
						profile: undefined as never,
						inventories: undefined as never,
						currencies: undefined as never,
						error: new AuthError("Authentication expired - please refresh"),
					});
					return;
				}

				// General server error
				console.error("General error:", error);
				res.status(500).json({
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
