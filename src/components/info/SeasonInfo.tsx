import type { CoreSettingsConfiguration } from "bungie-api-ts/core";
import type { DestinySeasonDefinition } from "bungie-api-ts/destiny2";

function weeksBetween(d1: number, d2: number) {
	const weeks = Math.floor((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
	const days = Math.floor((d2 - d1) / (24 * 60 * 60 * 1000)) - weeks * 7;
	const hours =
		Math.floor((d2 - d1) / (60 * 60 * 1000)) - weeks * 7 * 24 - days * 24;
	return { hours, days, weeks };
}

type PageProps = {
	allSeasons: {
		[key: number]: DestinySeasonDefinition;
	};
	commonSettings: CoreSettingsConfiguration;
};

export default function SeasonInfo({ allSeasons, commonSettings }: PageProps) {
	// console.log(allSeasons);
	// console.log(commonSettings.destiny2CoreSettings.futureSeasonHashes);

	let currentSeason = Object.values(allSeasons).find(
		(season) =>
			season.hash === commonSettings.destiny2CoreSettings.currentSeasonHash,
	);

	if (
		!currentSeason ||
		!currentSeason.endDate ||
		Date.parse(currentSeason.endDate) < Date.now()
	) {
		currentSeason = Object.values(allSeasons).find(
			(season) =>
				season.hash ===
				commonSettings.destiny2CoreSettings.futureSeasonHashes[0],
		);
	}

	if (!currentSeason || !currentSeason.endDate) return <></>;

	const { hours, days, weeks } = weeksBetween(
		Date.now(),
		Date.parse(currentSeason.endDate ?? Date.now().toString()),
	);

	return (
		<section className="w-fit mt-4 font-NeueHGD tracking-widest uppercase">
			<h4 className="text-2xl xl:text-3xl">
				Season {currentSeason.seasonNumber}
			</h4>
			<a
				href={`https://www.bungie.net/${currentSeason.displayProperties.name.replace(
					/\s+/g,
					"",
				)}`}
				target="_blank"
				rel="noopener"
			>
				<h3 className="my-2 text-4xl font-bold xl:text-5xl">
					{currentSeason.displayProperties.name}
				</h3>
			</a>
			<h4 className="text-xl xl:text-2xl">
				Season ends in:
				<span className="mx-2">
					{weeks > 0 && (
						<>
							<span className="mx-1">{weeks}</span>
							{weeks > 1 ? " weeks " : " week "}
						</>
					)}
					{days > 0 && (
						<>
							<span className="mx-1">{days}</span>
							{days > 1 ? " days " : " day "}
						</>
					)}
					{hours > 0 && (
						<>
							<span className="mx-1">{hours}</span>
							{hours > 1 ? " hours" : " hour"}
						</>
					)}
				</span>
			</h4>
		</section>
	);
}
