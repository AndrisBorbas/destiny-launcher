import fs from "fs";

import { getManifest, getSettings, getSlice } from "./destiny2-api-client";

export default async function getInitialD2Info(save?: boolean) {
	const destinyManifest = await getManifest();
	const manifestTables = await getSlice(destinyManifest, [
		"DestinySeasonDefinition",
		"DestinyPresentationNodeDefinition",
	]);

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
		version: destinyManifest.version,
		allSeasons: manifestTables.DestinySeasonDefinition,
		commonSettings,
		presentationNodes: manifestTables.DestinyPresentationNodeDefinition,
	};
}
