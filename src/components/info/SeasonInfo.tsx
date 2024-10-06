import clsx from "clsx";
import Image from "next/future/image";
import { Suspense } from "react";

import type { InfoResponse } from "@/pages/api/bungie/info";
import { currentCharacter, getClass } from "@/utils/bungieApi/utils";
import { useD2Info, useUser } from "@/utils/hooks";

import { TrackingLink } from "../link/TrackingLink";
import styles from "./SeasonInfo.module.scss";
import { SeasonTimer } from "./SeasonTimer";

export function SeasonInfo({ initialData }: { initialData: InfoResponse }) {
	const { data: swrD2Info, error } = useD2Info(initialData);
	const { user } = useUser("/", false);

	if (!swrD2Info) {
		// eslint-disable-next-line no-console
		console.error(error);
		return null;
	}

	let currentSeason = Object.values(swrD2Info.allSeasons).find(
		(season) =>
			season.hash === swrD2Info.destiny2CoreSettings.currentSeasonHash,
	);

	if (
		!currentSeason ||
		!currentSeason.endDate ||
		Date.parse(currentSeason.endDate) < Date.now()
	) {
		currentSeason = Object.values(swrD2Info.allSeasons).find(
			(season) =>
				season.hash === swrD2Info.destiny2CoreSettings.futureSeasonHashes[0],
		);
	}

	const seasonIcon = Object.values(swrD2Info.allSeasons).find(
		(node) =>
			node.displayProperties.name === currentSeason?.displayProperties.name &&
			node.displayProperties.hasIcon,
	);

	return (
		<Suspense>
			<section
				className={clsx(styles.grid, "mt-4 grid gap-3 p-2 font-NeueHGD")}
			>
				<div className="uppercase tracking-widest">
					<h4 className={clsx(styles.seasonCounter, "text-2xl xl:text-3xl")}>
						Season {currentSeason?.seasonNumber ?? "didn't load"}
					</h4>
					<TrackingLink
						href={`https://www.bungie.net/${
							currentSeason?.displayProperties.name
								.replace(/\s+/g, "")
								?.toLowerCase()
								.replace("episode:", "") ?? ""
						}`}
						target="_blank"
						rel="noopener noreferrer"
						isExternal
						eventName="season-link-click"
					>
						<div className="flex items-center">
							{seasonIcon && (
								<div className={styles.image}>
									<Image
										src={`https://bungie.net${
											// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
											seasonIcon.displayProperties.icon ?? ""
										}`}
										width={64}
										height={64}
										alt="Season Logo"
										unoptimized
										className="min-h-[48px] min-w-[48px]"
									/>
								</div>
							)}
							<h3
								className={clsx(
									styles.glow,
									"my-2 ml-1 text-4xl font-bold xl:text-5xl",
								)}
							>
								{currentSeason?.displayProperties.name ?? "Episode: [REDACTED]"}
							</h3>
						</div>
					</TrackingLink>
					{currentSeason?.endDate && (
						<SeasonTimer endDate={currentSeason.endDate} />
					)}
				</div>
				{user && (
					<div
						className={clsx(
							styles.min,
							"relative col-start-1 col-end-3 row-start-1 h-fit justify-self-end md:col-span-1 md:col-start-2",
							"-mx-2 sm:-mx-0",
						)}
					>
						<Image
							width={390}
							height={79}
							src={`https://bungie.net${
								currentCharacter(user.characters)?.emblemBackgroundPath
							}`}
							alt="User icon"
						/>
						<h3
							className={clsx(
								styles.left,
								styles.glow,
								"absolute top-2 w-[13.5rem] overflow-hidden overflow-ellipsis text-3xl",
							)}
						>
							{user.profile.userInfo.displayName}
						</h3>
						<h5 className={clsx(styles.left, "absolute bottom-3 text-base")}>
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
		</Suspense>
	);
}
