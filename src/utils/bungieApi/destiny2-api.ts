import type { CoreSettingsConfiguration } from "bungie-api-ts/core";
import { getCommonSettings } from "bungie-api-ts/core";
import type { DestinyManifest } from "bungie-api-ts/destiny2";
import {
	getDestinyManifest,
	getDestinyManifestSlice,
} from "bungie-api-ts/destiny2";
import fs from "fs";

import unauthenticatedHttpClient from "./client";

async function getManifest(): Promise<DestinyManifest> {
	const response = await getDestinyManifest(unauthenticatedHttpClient);
	return response.Response;
}
async function getSettings(): Promise<CoreSettingsConfiguration> {
	const response = await getCommonSettings(unauthenticatedHttpClient);
	return response.Response;
}

export default async function getD2Info(save?: boolean) {
	const destinyManifest = await getManifest();
	const manifestTables = await getDestinyManifestSlice(
		unauthenticatedHttpClient,
		{
			destinyManifest,
			tableNames: [
				"DestinySeasonDefinition",
				"DestinyPresentationNodeDefinition",
			],
			language: "en",
		},
	);

	// console.log(manifestTables.DestinyPresentationNodeDefinition)

	if (save) {
		const dir = "public/data";
		if (!fs.existsSync(dir)) fs.mkdirSync(dir);
		fs.writeFile(
			`${dir}/d2manifest.json`,
			JSON.stringify(destinyManifest),
			(err) => {
				if (err) throw err;
			},
		);
		fs.writeFile(
			`${dir}/seasoninfo.json`,
			JSON.stringify(manifestTables),
			(err) => {
				if (err) throw err;
			},
		);
	}

	const commonSettings = await getSettings();

	return {
		allSeasons: manifestTables.DestinySeasonDefinition,
		commonSettings,
		presentationNodes: manifestTables.DestinyPresentationNodeDefinition,
	};
}
