import clsx from "clsx";
import Image from "next/image";

import type { InfoResponse } from "@/pages/api/bungie/info";
import { currentCharacter, getClass } from "@/utils/bungieApi/utils";
import { useD2Info, useUser } from "@/utils/hooks";

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

	if (!currentSeason) {
		console.error("Could not find current season");
		return <></>;
	}

	const seasonIcon = Object.values(swrD2Info.presentationNodes).find(
		(node) =>
			node.displayProperties.name === currentSeason?.displayProperties.name &&
			node.displayProperties.hasIcon,
	);

	const { hours, days, weeks, minutes } = timeBetween(
		Date.now(),
		Date.parse(currentSeason.endDate ?? Date.now().toString()),
	);

	return (
		<section className={clsx(styles.grid, "grid gap-3 mt-4 p-2 font-NeueHGD")}>
			<div className="tracking-widest uppercase">
				<h4 className={clsx(styles.seasonCounter, "text-2xl xl:text-3xl")}>
					Season {currentSeason?.seasonNumber ?? "-1"}
				</h4>
				<a
					href={`https://www.bungie.net/${
						currentSeason?.displayProperties.name ??
						"destiny".replace(/\s+/g, "")
					}`}
					target="_blank"
					rel="noopener"
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
								/>
							</div>
						)}
						<h3
							className={clsx(
								styles.glow,
								"ml-1 my-2 text-4xl font-bold xl:text-5xl",
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
						"h-fit relative col-end-3 col-start-1 row-start-1 justify-self-end md:col-span-1 md:col-start-2",
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
							"absolute top-2 w-56 text-3xl overflow-hidden overflow-ellipsis",
						)}
					>
						{user.profile.userInfo.displayName}
					</h3>
					<h5 className={clsx(styles.left, "absolute bottom-4 text-base")}>
						{getClass(currentCharacter(user.characters)?.classType)}
					</h5>
					<h4
						className={clsx(
							styles.glow,
							"absolute right-4 top-2 text-yellow-300 text-3xl",
						)}
					>
						{currentCharacter(user.characters)?.light}
					</h4>
				</div>
			)}
		</section>
	);
}
