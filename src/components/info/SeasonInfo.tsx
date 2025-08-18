import Image from "next/image";
import { Suspense } from "react";

import type { InfoResponse } from "@/pages/api/bungie/info";
import { currentCharacter, getClass } from "@/utils/bungieApi/utils";
import { useD2Info, useUser } from "@/utils/hooks";
import { cn } from "@/utils/utils";

import { TrackingLink } from "../link/TrackingLink";
import styles from "./SeasonInfo.module.css";
import { SeasonTimer } from "./SeasonTimer";

export function SeasonInfo({ initialData }: { initialData: InfoResponse }) {
	const { data: swrD2Info, error } = useD2Info(initialData);
	const { user } = useUser();

	if (!swrD2Info) {
		console.error(error);
		return null;
	}

	let currentSeason = Object.values(swrD2Info.allSeasons).find(
		(season) =>
			season.hash === swrD2Info.destiny2CoreSettings.currentSeasonHash,
	);

	if (
		!currentSeason?.endDate ||
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
			<section className={cn(styles.grid, "font-display mt-4 grid gap-3 p-2")}>
				<div className="tracking-widest uppercase">
					<h4 className={cn(styles.seasonCounter, "text-2xl xl:text-3xl")}>
						Season {currentSeason?.seasonNumber ?? "didn't load"}
					</h4>
					<TrackingLink
						href={
							// disable flavour link cause bungie didn't do a season page
							/*
							 `https://www.bungie.net/${ currentSeason?.displayProperties.name.replace(/\s+/g, "") ?? "" }`
							*/
							"https://www.destinythegame.com/YearOfProphecy"
						}
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
										style={{
											maxWidth: "100%",
											height: "auto",
										}}
									/>
								</div>
							)}
							<h3
								className={cn(
									styles.glow,
									"my-2 ml-1 text-4xl font-bold xl:text-5xl",
								)}
							>
								{currentSeason?.displayProperties.name ??
									"Season of the [REDACTED]"}
							</h3>
						</div>
					</TrackingLink>
					{currentSeason?.endDate && (
						<SeasonTimer endDate={currentSeason.endDate} />
					)}
				</div>
				{user && (
					<div
						className={cn(
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
							style={{
								maxWidth: "100%",
								height: "auto",
							}}
						/>
						<h3
							className={cn(
								styles.left,
								styles.glow,
								"absolute top-2 w-54 overflow-hidden text-3xl text-ellipsis",
							)}
						>
							{user.profile.userInfo.displayName}
						</h3>
						<h5 className={cn(styles.left, "absolute bottom-3 text-base")}>
							{getClass(currentCharacter(user.characters)?.classType)}
						</h5>
						<h4
							className={cn(
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
