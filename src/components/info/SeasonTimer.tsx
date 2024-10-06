import clsx from "clsx";
import { useEffect } from "react";

import { useBool } from "@/utils/hooks";

import styles from "./SeasonTimer.module.scss";

/** Calculates the time between two dates
 * @param d1 the first date in number form
 * @param d2 the second date in number form
 * @returns the weeks, days, hours and minutes in an object
 */
function timeBetween(d1: number, d2: number) {
	let delta = Math.abs(d1 - d2) / 1000;
	const weeks = Math.floor(delta / 604800);
	delta -= weeks * 604800;
	const days = Math.floor(delta / 86400);
	delta -= days * 86400;
	const hours = Math.floor(delta / 3600) % 24;
	delta -= hours * 3600;
	const minutes = (Math.floor(delta / 60) % 60) + 1;

	return { weeks, days, hours, minutes };
}

export type SeasonTimerProps = {
	endDate: string;
};

export function SeasonTimer({ endDate }: SeasonTimerProps) {
	const [isResetTime, ResetTimeHandlers] = useBool(false);

	useEffect(() => {
		const interval = setInterval(() => {
			ResetTimeHandlers.toggle();
		}, 7000);
		return () => clearInterval(interval);
	}, [ResetTimeHandlers, isResetTime]);

	const { weeks, days, hours, minutes } = timeBetween(
		Date.now(),
		Date.parse(endDate),
	);

	return (
		<button
			className="text-left"
			onClick={() => ResetTimeHandlers.toggle()}
			type="button"
		>
			<h4
				className={clsx(
					styles.seasonTimer,
					"text-xl uppercase xl:text-2xl",
					isResetTime ? "hidden" : "initial",
				)}
			>
				Episode ends in:
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
					{weeks + days <= 0 && (
						<>
							<span className="mx-1">{minutes}</span>
							{minutes > 1 ? " minutes" : " minute"}
						</>
					)}
				</span>
			</h4>
			<h4
				className={clsx(
					styles.seasonTimer,
					"text-xl uppercase xl:text-2xl",
					!isResetTime ? "hidden" : "initial",
				)}
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
			</h4>
		</button>
	);
}
