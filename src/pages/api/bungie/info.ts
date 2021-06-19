import type { CoreSettingsConfiguration } from "bungie-api-ts/core";
import type {
	DestinyPresentationNodeDefinition,
	DestinySeasonDefinition,
} from "bungie-api-ts/destiny2";
import type { NextApiRequest, NextApiResponse } from "next";

import {
	getManifest,
	getSettings,
	getSlice,
} from "@/utils/bungieApi/destiny2-api-client";

export type InfoResponse = {
	version: string;
	allSeasons: {
		[key: number]: DestinySeasonDefinition;
	};
	commonSettings: CoreSettingsConfiguration;
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
				const manifest = await getManifest();

				const manifestTables = await getSlice(manifest, [
					"DestinySeasonDefinition",
					"DestinyPresentationNodeDefinition",
				]);
				const commonSettings = await getSettings();

				const seasonNodes = Object.values(
					manifestTables.DestinyPresentationNodeDefinition,
				).filter((node) =>
					node.displayProperties.name.toLowerCase().includes("season of"),
				);

				const data: InfoResponse = {
					version: manifest.version,
					allSeasons: manifestTables.DestinySeasonDefinition,
					commonSettings,
					presentationNodes: seasonNodes,
				};

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
