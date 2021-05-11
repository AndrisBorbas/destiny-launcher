import type { CoreSettingsConfiguration } from "bungie-api-ts/core";
import type {
	DestinyPresentationNodeDefinition,
	DestinySeasonDefinition,
} from "bungie-api-ts/destiny2";
import clsx from "clsx";
import Image from "next/image";

import styles from "./SeasonInfo.module.scss";

function timeBetween(d1: number, d2: number) {
	const weeks = Math.floor((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
	const days = Math.floor((d2 - d1) / (24 * 60 * 60 * 1000)) - weeks * 7;
	const hours =
		Math.floor((d2 - d1) / (60 * 60 * 1000)) - weeks * 7 * 24 - days * 24;
	const minutes =
		Math.floor((d2 - d1) / (60 * 1000)) -
		weeks * 7 * 24 -
		days * 24 -
		hours * 60 +
		1;
	return { hours, days, weeks, minutes };
}

type PageProps = {
	allSeasons: {
		[key: number]: DestinySeasonDefinition;
	};
	commonSettings: CoreSettingsConfiguration;
	presentationNodes: {
		[key: number]: DestinyPresentationNodeDefinition;
	};
};

export default function SeasonInfo({
	allSeasons,
	commonSettings,
	presentationNodes,
}: PageProps) {
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

	if (!currentSeason) return <></>;

	const seasonIcon = Object.values(presentationNodes).find(
		(node) =>
			node.displayProperties.name === currentSeason?.displayProperties.name &&
			node.displayProperties.hasIcon,
	);

	console.log(currentSeason.endDate);

	const { hours, days, weeks, minutes } = timeBetween(
		Date.now(),
		Date.parse(
			"2021-05-11T15:00:00Z" ?? currentSeason.endDate ?? Date.now().toString(),
		),
	);

	return (
		<section className="w-fit mt-4 p-2 font-NeueHGD tracking-widest uppercase">
			<h4 className={clsx(styles.seasonCounter, "text-2xl xl:text-3xl")}>
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
				<div className="flex items-center">
					{seasonIcon && (
						<div className={styles.image}>
							<Image
								src={`https://bungie.net${seasonIcon?.displayProperties.icon}`}
								width={64}
								height={64}
							/>
						</div>
					)}
					<h3
						className={clsx(
							styles.seasonName,
							"ml-1 my-2 text-4xl font-bold xl:text-5xl",
						)}
					>
						{currentSeason.displayProperties.name}
					</h3>
				</div>
			</a>
			<h4 className={clsx(styles.seasonTimer, "text-xl xl:text-2xl")}>
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
					{weeks + days + hours <= 0 && (
						<>
							<span className="mx-1">{minutes}</span>
							{minutes > 1 ? " minutes" : " minute"}
						</>
					)}
				</span>
			</h4>
		</section>
	);
}
