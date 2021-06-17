import type {
	DestinyCharacterComponent,
	DestinyProfileComponent,
} from "bungie-api-ts/destiny2";
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
	error?: AuthError;
};

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ProfileResponse>,
) => {
	switch (req.method) {
		case "GET": {
			try {
				const user = await fetchUserProfileFromBungie(req.cookies.accessToken);
				if (!user.profile.data || !user.characters.data) {
					throw new Error("No data inside fetched profile");
				}

				const data = {
					characters: user.characters.data,
					profile: user.profile.data,
				};

				return res.status(200).json(data);
			} catch (error) {
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
