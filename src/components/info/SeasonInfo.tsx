import clsx from "clsx";
import Image from "next/image";

import type { InfoResponse } from "@/pages/api/bungie/info";
import { currentCharacter, getClass } from "@/utils/bungieApi/utils";
import { useD2Info, useUser } from "@/utils/hooks";

import styles from "./SeasonInfo.module.scss";

/** Calculates the time between two dates
 * @param d1 the first date in number form
 * @param d2 the second date in number form
 * @returns {{ minutes: number, hours: number, days: number, weeks: number}} the minutes, hours, days and weeks in an object
 */
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
	return { minutes, hours, days, weeks };
}

export default function SeasonInfo({
	initialData,
}: {
	initialData: InfoResponse;
}) {
	const { data: swrD2Info, error } = useD2Info(initialData);
	const { user, error: userError, isLoading, mutateUser } = useUser("/", false);

	if (!swrD2Info) {
		console.error("Season info not yet loaded");
		return <></>;
	}

	let currentSeason = Object.values(swrD2Info.allSeasons).find(
		(season) =>
			season.hash ===
			swrD2Info.commonSettings.destiny2CoreSettings.currentSeasonHash,
	);

	if (
		!currentSeason ||
		!currentSeason.endDate ||
		Date.parse(currentSeason.endDate) < Date.now()
	) {
		currentSeason = Object.values(swrD2Info.allSeasons).find(
			(season) =>
				season.hash ===
				swrD2Info.commonSettings.destiny2CoreSettings.futureSeasonHashes[0],
		);
	}

	const seasonIcon = Object.values(swrD2Info.presentationNodes).find(
		(node) =>
			node.displayProperties.name === currentSeason?.displayProperties.name &&
			node.displayProperties.hasIcon,
	);

	const { minutes, hours, days, weeks } = timeBetween(
		Date.now(),
		Date.parse(currentSeason?.endDate ?? Date.now().toString()),
	);

	return (
		<section className={clsx(styles.grid, "grid gap-3 p-2 mt-4 font-NeueHGD")}>
			<div className="tracking-widest uppercase">
				<h4 className={clsx(styles.seasonCounter, "text-2xl xl:text-3xl")}>
					Season {currentSeason?.seasonNumber ?? "didn't load"}
				</h4>
				<a
					href={`https://www.bungie.net/${
						currentSeason?.displayProperties.name.replace(/\s+/g, "") ?? ""
					}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<div className="flex items-center">
						{seasonIcon && (
							<div className={styles.image}>
								<Image
									src={`https://bungie.net${
										seasonIcon?.displayProperties.icon ?? ""
									}`}
									width={64}
									height={64}
									alt="Season Logo"
									unoptimized
								/>
							</div>
						)}
						<h3
							className={clsx(
								styles.glow,
								"my-2 ml-1 text-4xl xl:text-5xl font-bold",
							)}
						>
							{currentSeason?.displayProperties.name ??
								"Season of the [REDACTED]"}
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
			</div>
			{user && (
				<div
					className={clsx(
						styles.min,
						"relative md:col-span-1 col-start-1 md:col-start-2 col-end-3 row-start-1 justify-self-end h-fit",
					)}
				>
					<Image
						width={390}
						height={79}
						layout="intrinsic"
						src={`https://bungie.net${
							currentCharacter(user.characters)?.emblemBackgroundPath
						}`}
						alt="User icon"
					/>
					<h3
						className={clsx(
							styles.left,
							styles.glow,
							"overflow-hidden absolute top-2 w-[13.5rem] text-3xl overflow-ellipsis",
						)}
					>
						{user.profile.userInfo.displayName}
					</h3>
					<h5 className={clsx(styles.left, "absolute bottom-4 text-base")}>
						{getClass(currentCharacter(user.characters)?.classType)}
					</h5>
					<h4
						className={clsx(
							styles.light,
							styles.glow,
							"absolute top-2 right-4 text-3xl text-yellow-300",
						)}
					>
						{currentCharacter(user.characters)?.light}
					</h4>
				</div>
			)}
		</section>
	);
}
