import clsx from "clsx";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

import type { InfoResponse } from "@/pages/api/bungie/info";
import { currentCharacter, getClass } from "@/utils/bungieApi/utils";
import { useBool, useD2Info, useUser } from "@/utils/hooks";

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
		weeks * 7 * 24 * 60 -
		days * 24 * 60 -
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
	const { user } = useUser("/", false);
	const [isResetTime, ResetTimeHandlers] = useBool(false);
	const controls = useAnimation();

	function toggleReset() {
		ResetTimeHandlers.toggle();
		controls.set({
			// @ts-expect-error: Custom css variables work
			"--after-w": "100%",
		});
		controls.start({
			// @ts-expect-error: Custom css variables work
			"--after-w": "0%",
			transition: { duration: 7, ease: "easeOut" },
		});
	}

	useEffect(() => {
		const interval = setInterval(() => {
			toggleReset();
		}, 7000);
		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isResetTime]);

	if (!swrD2Info) {
		// eslint-disable-next-line no-console
		console.error(error);
		return null;
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
				<button onClick={() => toggleReset()} type="button">
					<motion.h4
						className={clsx(
							styles.seasonTimer,
							"text-xl xl:text-2xl uppercase",
							isResetTime === true ? "hidden" : "initial",
						)}
						// @ts-expect-error: Variants work, I don't know why it is an error
						initial={{ "--after-w": "100%" }}
						animate={controls}
						transition={{
							duration: 7,
							repeat: Infinity,
							ease: "linear",
						}}
						transitionEnd={{ "--after-w": "100%" }}
					>
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
									{hours > 1 ? " hours " : " hour "}
								</>
							)}
							{weeks + days + hours <= 0 && (
								<>
									<span className="mx-1">{minutes}</span>
									{minutes > 1 ? " minutes" : " minute"}
								</>
							)}
						</span>
					</motion.h4>
					<motion.h4
						className={clsx(
							styles.seasonTimer,
							"text-xl xl:text-2xl uppercase",
							isResetTime === false ? "hidden" : "initial",
						)}
						// @ts-expect-error: Variants work, I don't know why it is an error
						initial={{ "--after-w": "100%" }}
						animate={controls}
						transition={{
							duration: 7,
							repeat: Infinity,
							ease: "linear",
						}}
						transitionEnd={{ "--after-w": "100%" }}
					>
						Weekly reset in:
						<span className="mx-2">
							{days > 0 && (
								<>
									<span className="mx-1">{days}</span>
									{days > 1 ? " days " : " day "}
								</>
							)}
							{hours > 0 && (
								<>
									<span className="mx-1">{hours}</span>
									{hours > 1 ? " hours " : " hour "}
								</>
							)}
							{days <= 0 && (
								<>
									<span className="mx-1">{minutes}</span>
									{minutes > 1 ? " minutes" : " minute"}
								</>
							)}
						</span>
					</motion.h4>
				</button>
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
							"overflow-hidden absolute top-2 text-3xl overflow-ellipsis w-[13.5rem]",
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
