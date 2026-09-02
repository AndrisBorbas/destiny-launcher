import type {
	DestinyCharacterComponent,
	DestinyObjectiveProgress,
} from "bungie-api-ts/destiny2";
import Image from "next/image";
import { useMemo, useSyncExternalStore } from "react";
import { HiChevronDown } from "react-icons/hi";

import { ClassIcon } from "@/components/dashboard/CharacterComponents";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ItemDefinitionsResponse } from "@/pages/api/bungie/items";
import { buckets } from "@/utils/bungieApi/itemDefinitions";
import { currentCharacter, getClass } from "@/utils/bungieApi/utils";
import { useUser } from "@/utils/hooks";
import { useItemDefinitions } from "@/utils/hooks/useItemDefinitions";
import { useObjectiveDefinitions } from "@/utils/hooks/useObjectiveDefinitions";
import { cn } from "@/utils/utils";

import styles from "../banner/Banner.module.css";

type Bounty = {
	itemInstanceId: string;
	itemHash: number;
	objectives: DestinyObjectiveProgress[];
	complete: boolean;
	expirationDate?: string;
};

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

function subscribeToClock(onTick: () => void) {
	const interval = setInterval(onTick, MINUTE);
	return () => {
		clearInterval(interval);
	};
}

// Rounded to the minute so the snapshot stays stable between ticks
function clockSnapshot() {
	return Math.floor(Date.now() / MINUTE) * MINUTE;
}

function serverClockSnapshot() {
	return null;
}

/**
 * Keeps a ticking timestamp so expiry countdowns stay current
 * @returns The current time to the minute, or null before hydration
 */
function useNow() {
	return useSyncExternalStore(
		subscribeToClock,
		clockSnapshot,
		serverClockSnapshot,
	);
}

/**
 * Time left until a bounty expires, in the game's own d/h/m shorthand
 * @param expirationDate ISO date the bounty expires at
 * @param now Current timestamp
 * @returns Formatted time left, or null if the date can't be read
 */
function timeLeft(expirationDate: string, now: number) {
	const remaining = Date.parse(expirationDate) - now;
	if (Number.isNaN(remaining)) return null;
	if (remaining <= 0) return "Expired";

	const minutes = Math.floor(remaining / 60000);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) return `${days}d ${hours % 24}h`;
	if (hours > 0) return `${hours}h ${minutes % 60}m`;
	return `${minutes}m`;
}

type CharacterBounties = {
	character: DestinyCharacterComponent;
	bounties: Bounty[];
};

type ObjectiveProgressProps = {
	objective: DestinyObjectiveProgress;
	description: string;
};

function ObjectiveProgress({ objective, description }: ObjectiveProgressProps) {
	const completionValue = objective.completionValue || 1;
	const percent = Math.min(
		100,
		Math.round((objective.progress ?? 0) * (100 / completionValue)),
	);
	// Objectives that only have a single step are shown as a checkbox in game
	const isBoolean = completionValue === 1;

	return (
		<div className="flex flex-row items-center gap-2">
			<div
				className={cn(
					"size-4 shrink-0 border border-gray-300/50",
					objective.complete && "border-white/80 bg-white/80",
				)}
			/>
			<div className="relative h-5 grow overflow-hidden bg-gray-900/40 backdrop-blur">
				{!isBoolean && (
					<div
						className={cn(
							"absolute inset-y-0 left-0 bg-green-400/50",
							objective.complete && "bg-green-500/70",
						)}
						style={{ width: `${percent}%` }}
					/>
				)}
				<div className="relative flex h-full flex-row items-center justify-between gap-2 px-1.5">
					<span className="overflow-hidden text-sm text-ellipsis whitespace-nowrap">
						{description}
					</span>
					{!isBoolean && (
						<span className="shrink-0 text-sm tabular-nums">
							({objective.progress ?? 0} / {completionValue}) {percent}%
						</span>
					)}
				</div>
			</div>
		</div>
	);
}

type BountyCardProps = {
	bounty: Bounty;
	name: string;
	description: string;
	icon: string;
	objectiveDescriptions: { [hash: string]: string };
	now: number | null;
};

function BountyCard({
	bounty,
	name,
	description,
	icon,
	objectiveDescriptions,
	now,
}: BountyCardProps) {
	const remaining =
		bounty.expirationDate && now !== null
			? timeLeft(bounty.expirationDate, now)
			: null;
	const expired = remaining === "Expired";
	const expiringSoon =
		!expired &&
		!!bounty.expirationDate &&
		now !== null &&
		Date.parse(bounty.expirationDate) - now < HOUR;

	return (
		<div className="flex flex-row gap-2">
			<Tooltip>
				<TooltipTrigger asChild>
					<Image
						width={48}
						height={48}
						src={`https://bungie.net${icon}`}
						alt={name}
						className={cn(
							"size-12 shrink-0 self-start border border-gray-300/30",
							bounty.complete && "border-teal-200/80",
						)}
					/>
				</TooltipTrigger>
				<TooltipContent>
					<p className="max-w-64">
						<span className="font-bold">{name}</span>
						{description && <span className="block">{description}</span>}
					</p>
				</TooltipContent>
			</Tooltip>

			<div className="flex min-w-0 grow flex-col gap-1">
				<div className="flex flex-row items-baseline gap-2">
					<p className="glow overflow-hidden text-lg leading-tight font-medium text-ellipsis whitespace-nowrap">
						{name}
					</p>
					{remaining && (
						<span
							className={cn(
								"ml-auto shrink-0 text-sm tabular-nums",
								expiringSoon && "text-yellow-400/90",
								expired && "text-orange-500/90",
							)}
						>
							{remaining}
						</span>
					)}
				</div>
				{bounty.objectives.map((objective) => (
					<ObjectiveProgress
						key={objective.objectiveHash}
						objective={objective}
						description={
							objectiveDescriptions[objective.objectiveHash.toString(10)] ||
							name
						}
					/>
				))}
			</div>
		</div>
	);
}

type CharacterOrdersProps = {
	character: DestinyCharacterComponent;
	bounties: Bounty[];
	defaultOpen: boolean;
	itemDefinitions?: ItemDefinitionsResponse;
	objectiveDescriptions: { [hash: string]: string };
	now: number | null;
};

function CharacterOrders({
	character,
	bounties,
	defaultOpen,
	itemDefinitions,
	objectiveDescriptions,
	now,
}: CharacterOrdersProps) {
	return (
		<details className="group flex flex-col" open={defaultOpen}>
			<summary className="flex w-fit cursor-pointer list-none flex-row items-center gap-2 rounded-t border-b border-gray-300/30 bg-gray-700/20 px-2 py-1 backdrop-blur-xs">
				<HiChevronDown className="size-5 shrink-0 transition-transform group-open:rotate-180" />
				<ClassIcon
					classType={character.classType}
					className="size-5 text-white drop-shadow-md drop-shadow-black/50"
				/>
				<h4 className="glow text-xl font-medium">
					{getClass(character.classType)}
				</h4>
			</summary>

			<div className="mt-3 flex flex-col gap-3">
				{bounties.map((bounty) => {
					const definition =
						itemDefinitions?.items[bounty.itemHash.toString(10)];
					if (!definition) return null;

					return (
						<BountyCard
							key={bounty.itemInstanceId}
							bounty={bounty}
							name={definition.displayProperties.name}
							description={definition.displayProperties.description}
							icon={definition.displayProperties.icon}
							objectiveDescriptions={objectiveDescriptions}
							now={now}
						/>
					);
				})}
			</div>
		</details>
	);
}

export function Bounties() {
	const { user } = useUser();
	const now = useNow();

	const current = useMemo(() => currentCharacter(user?.characters), [user]);

	const characterBounties = useMemo<CharacterBounties[]>(() => {
		if (!user?.characterInventories || !user.itemObjectives) return [];

		return Object.entries(user.characterInventories)
			.map(([characterId, inventory]) => {
				const bounties: Bounty[] = inventory.items
					.filter(
						(item) => item.bucketHash === buckets.quests && item.itemInstanceId,
					)
					.map((item) => {
						const objectives =
							user.itemObjectives?.[item.itemInstanceId ?? ""]?.objectives ??
							[];
						const visibleObjectives = objectives.filter(
							(objective) => objective.visible,
						);

						return {
							itemInstanceId: item.itemInstanceId ?? "",
							itemHash: item.itemHash,
							objectives: visibleObjectives,
							complete: visibleObjectives.every(
								(objective) => objective.complete,
							),
							expirationDate: item.expirationDate,
						};
					})
					// Quest steps without any objective progress have nothing to show
					.filter((bounty) => bounty.objectives.length > 0);

				// Show what is still in progress first, then whatever expires soonest
				bounties.sort(
					(a, b) =>
						Number(a.complete) - Number(b.complete) ||
						(a.expirationDate ? Date.parse(a.expirationDate) : Infinity) -
							(b.expirationDate ? Date.parse(b.expirationDate) : Infinity),
				);

				return { character: user.characters[characterId], bounties };
			})
			.filter(
				(entry): entry is CharacterBounties =>
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					!!entry.character && entry.bounties.length > 0,
			)
			.sort(
				(a, b) =>
					Number(b.character.characterId === current?.characterId) -
					Number(a.character.characterId === current?.characterId),
			);
	}, [user, current]);

	const itemHashes = useMemo(
		() =>
			characterBounties.flatMap((entry) =>
				entry.bounties.map((bounty) => bounty.itemHash),
			),
		[characterBounties],
	);

	const objectiveHashes = useMemo(
		() =>
			characterBounties.flatMap((entry) =>
				entry.bounties.flatMap((bounty) =>
					bounty.objectives.map((objective) => objective.objectiveHash),
				),
			),
		[characterBounties],
	);

	const { data: itemDefinitions } = useItemDefinitions(itemHashes);
	const { data: objectiveDefinitions } =
		useObjectiveDefinitions(objectiveHashes);

	const objectiveDescriptions = useMemo(() => {
		const descriptions: { [hash: string]: string } = {};
		Object.entries(objectiveDefinitions?.objectives ?? {}).forEach(
			([hash, definition]) => {
				descriptions[hash] =
					definition.progressDescription ||
					definition.displayProperties.name ||
					"";
			},
		);
		return descriptions;
	}, [objectiveDefinitions]);

	if (characterBounties.length === 0) return null;

	return (
		<div className="flex flex-col gap-4">
			<h3 className={cn(styles.headerText, "w-full self-auto!")}>Orders</h3>
			{characterBounties.map(({ character, bounties }) => (
				<CharacterOrders
					key={character.characterId}
					character={character}
					bounties={bounties}
					// Only the character you last played is expanded by default
					defaultOpen={character.characterId === current?.characterId}
					itemDefinitions={itemDefinitions}
					objectiveDescriptions={objectiveDescriptions}
					now={now}
				/>
			))}
		</div>
	);
}
