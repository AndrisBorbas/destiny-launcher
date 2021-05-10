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
			tableNames: ["DestinySeasonDefinition"],
			language: "en",
		},
	);

	if (save) {
		fs.mkdirSync("public/data");
		fs.writeFile(
			"public/data/d2manifest.json",
			JSON.stringify(destinyManifest),
			(err) => {
				if (err) throw err;
			},
		);
		fs.writeFile(
			"public/data/seasoninfo.json",
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
	};
}
