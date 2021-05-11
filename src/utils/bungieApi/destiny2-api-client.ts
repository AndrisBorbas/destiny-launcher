import type { CoreSettingsConfiguration } from "bungie-api-ts/core";
import { getCommonSettings } from "bungie-api-ts/core";
import type {
	DestinyManifest,
	DestinyManifestComponentName,
} from "bungie-api-ts/destiny2";
import {
	getDestinyManifest,
	getDestinyManifestSlice,
} from "bungie-api-ts/destiny2";

import unauthenticatedHttpClient from "./client";

export async function getManifest(): Promise<DestinyManifest> {
	const response = await getDestinyManifest(unauthenticatedHttpClient);
	return response.Response;
}
export async function getSettings(): Promise<CoreSettingsConfiguration> {
	const response = await getCommonSettings(unauthenticatedHttpClient);
	return response.Response;
}

export async function getSlice<T extends DestinyManifestComponentName[]>(
	destinyManifest: DestinyManifest,
	tableNames: T,
) {
	const manifestTables = await getDestinyManifestSlice(
		unauthenticatedHttpClient,
		{
			destinyManifest,
			tableNames,
			language: "en",
		},
	);
	return manifestTables;
}
