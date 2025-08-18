import Hunter from "@icons/general/class_hunter.svg";
import Titan from "@icons/general/class_titan.svg";
import Warlock from "@icons/general/class_warlock.svg";
import { DestinyStatDefinition } from "bungie-api-ts/destiny2";
import Image from "next/image";

import { cn } from "@/utils/utils";

type StatDisplayProps = {
	stat: DestinyStatDefinition;
	value: number;
	small?: boolean;
};

export function StatDisplay({ stat, value, small }: StatDisplayProps) {
	return (
		<div
			className="flex flex-row items-center drop-shadow-md drop-shadow-black/50"
			title={`${stat.displayProperties.name} - ${stat.displayProperties.description}`}
		>
			<Image
				src={`https://bungie.net${stat.displayProperties.icon}`}
				alt={stat.displayProperties.name}
				className={cn(small ? "h-6 w-6" : "h-8 w-8")}
				width={32}
				height={32}
			/>
			<span className={cn("font-bold", small ? "text-lg" : "text-2xl")}>
				{value}
			</span>
		</div>
	);
}

type ClassIconProps = {
	classType: number;
	className?: string;
};

export function ClassIcon({ classType, className }: ClassIconProps) {
	switch (classType) {
		case 0:
			return (
				<Titan
					className={className}
					style={{ fill: "currentColor" }}
					title="Titan"
				/>
			);
		case 1:
			return (
				<Hunter
					className={className}
					style={{ fill: "currentColor" }}
					title="Hunter"
				/>
			);
		case 2:
			return (
				<Warlock
					className={className}
					style={{ fill: "currentColor" }}
					title="Warlock"
				/>
			);
		default:
			return null;
	}
}
