import Hunter from "@icons/general/class_hunter.svg";
import Titan from "@icons/general/class_titan.svg";
import Warlock from "@icons/general/class_warlock.svg";
import { DestinyStatDefinition } from "bungie-api-ts/destiny2";
import Image from "next/image";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utils/utils";

type StatDisplayProps = {
	stat: DestinyStatDefinition;
	value: number;
	small?: boolean;
};

export function StatDisplay({ stat, value, small }: StatDisplayProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div className="flex flex-row items-center drop-shadow-md drop-shadow-black/50">
					<Image
						src={`https://bungie.net${stat.displayProperties.icon}`}
						alt={stat.displayProperties.name}
						className={cn(small ? "h-6 w-6" : "h-8 w-8")}
						width={small ? 24 : 32}
						height={small ? 24 : 32}
					/>
					<span className={cn("font-bold", small ? "text-lg" : "text-2xl")}>
						{value}
					</span>
				</div>
			</TooltipTrigger>
			<TooltipContent>
				<p className="text-sm font-bold">
					{stat.displayProperties.name} -{" "}
					<span className="text-xs">{stat.displayProperties.description}</span>
				</p>
			</TooltipContent>
		</Tooltip>
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
					alt="Titan"
				/>
			);
		case 1:
			return (
				<Hunter
					className={className}
					style={{ fill: "currentColor" }}
					title="Hunter"
					alt="Hunter"
				/>
			);
		case 2:
			return (
				<Warlock
					className={className}
					style={{ fill: "currentColor" }}
					title="Warlock"
					alt="Warlock"
				/>
			);
		default:
			return null;
	}
}
