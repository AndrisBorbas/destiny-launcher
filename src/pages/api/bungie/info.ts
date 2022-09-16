import type { Destiny2CoreSettings } from "bungie-api-ts/core";
import type {
	DestinyPresentationNodeDefinition,
	DestinySeasonDefinition,
} from "bungie-api-ts/destiny2";
import type { NextApiRequest, NextApiResponse } from "next";

import { getInitialD2Info } from "@/utils/bungieApi/destiny2-api-server";

export type InfoResponse = {
	version: string;
	allSeasons: {
		[key: number]: DestinySeasonDefinition;
	};
	destiny2CoreSettings: Destiny2CoreSettings;
	presentationNodes: {
		[key: number]: DestinyPresentationNodeDefinition;
	};
};

export default async (
	req: NextApiRequest,
	res: NextApiResponse<InfoResponse>,
) => {
	switch (req.method) {
		case "GET": {
			try {
				const data = await getInitialD2Info(false);

				return res.status(200).json(data);
			} catch (error) {
				console.error(error);
				return res.status(401).end();
			}
		}

		default: {
			res.setHeader("Allow", "GET");
			return res.status(405).end();
		}
	}
};
