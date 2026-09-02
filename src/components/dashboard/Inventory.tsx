import Image from "next/image";
import { useMemo } from "react";
import { HiChevronDown, HiExclamation } from "react-icons/hi";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	ALL_CURRENCY_HASHES,
	ALL_MATERIAL_HASHES,
	items,
	MATERIAL_HASHES,
} from "@/utils/bungieApi/itemDefinitions";
import { useUser } from "@/utils/hooks";
import { useItemDefinitions } from "@/utils/hooks/useItemDefinitions";
import { cn } from "@/utils/utils";

type CurrencyData = {
	name: string;
	icon: string;
	maxStackSize?: number;
	quantity: number;
};

export function Currencies() {
	const { user } = useUser();

	const { data: currencyDefinitions } = useItemDefinitions(ALL_CURRENCY_HASHES);

	const currencyData = useMemo(() => {
		if (!user) return [];

		const data = new Map<number, CurrencyData>();

		if (user.currencies && currencyDefinitions) {
			user.currencies.items.forEach((item) => {
				const hash = item.itemHash.toString(10);
				const definition = currencyDefinitions.items[hash];
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				if (!definition) return;

				const existing = data.get(item.itemHash);
				if (existing) {
					existing.quantity += item.quantity;
				} else {
					data.set(item.itemHash, {
						name: definition.displayProperties.name,
						icon: definition.displayProperties.icon,
						maxStackSize: definition.inventory?.maxStackSize,
						quantity: item.quantity,
					});
				}
			});
		}

		if (user.silver && currencyDefinitions) {
			const maxSilver = Math.max(
				...Object.values(user.silver.platformSilver).map(
					(silver) => silver.quantity,
				),
			);
			if (maxSilver > 0) {
				data.set(items.silver, {
					name: currencyDefinitions.items[items.silver].displayProperties.name,
					icon: currencyDefinitions.items[items.silver].displayProperties.icon,
					maxStackSize:
						currencyDefinitions.items[items.silver].inventory?.maxStackSize,
					quantity: maxSilver,
				});
			}
		}

		const array = Array.from(data.entries());
		array.sort((a, b) => {
			const indexA = (ALL_CURRENCY_HASHES as number[]).indexOf(a[0]);
			const indexB = (ALL_CURRENCY_HASHES as number[]).indexOf(b[0]);
			return indexA - indexB;
		});

		return array;
	}, [user, currencyDefinitions]);

	return (
		<div className="grid grid-cols-[repeat(auto-fill,_8.25rem)] gap-4">
			{currencyData.map(([key, currency]) => {
				const atLimit = currency.maxStackSize
					? currency.quantity % currency.maxStackSize === 0
					: false;
				const nearLimit = currency.maxStackSize
					? currency.quantity % currency.maxStackSize >=
						currency.maxStackSize * 0.95
					: false;
				return (
					<Tooltip key={key}>
						<TooltipTrigger asChild>
							<div className="flex items-center rounded-t border-b border-gray-300/30 bg-gray-700/20 pr-1 backdrop-blur">
								<Image
									width={32}
									height={32}
									src={`https://bungie.net/${currency.icon}`}
									alt={currency.name}
									className="mr-2 size-8"
								/>
								<p className="tabular-nums">
									{(nearLimit || atLimit) && (
										<span>
											<HiExclamation
												className={cn(
													"mr-1 inline-block size-6 align-text-top text-yellow-400/90",
													atLimit && "text-orange-500/90",
												)}
											/>
										</span>
									)}
									{currency.quantity.toLocaleString("en-US", {
										style: "decimal",
									})}
								</p>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>
								{currency.name}:{" "}
								{currency.quantity.toLocaleString("en-US", {
									style: "decimal",
								})}{" "}
								/{" "}
								{currency.maxStackSize?.toLocaleString("en-US", {
									style: "decimal",
								}) ?? "∞"}
							</p>
						</TooltipContent>
					</Tooltip>
				);
			})}
		</div>
	);
}

type MaterialCountProps = {
	name: string;
	icon: string;
	quantity: number;
	maxStackSize?: number;
};

function MaterialCount({
	name,
	icon,
	quantity,
	maxStackSize,
}: MaterialCountProps) {
	const atLimit = maxStackSize ? quantity % maxStackSize === 0 : false;
	const nearLimit = maxStackSize
		? quantity % maxStackSize >= maxStackSize * 0.95
		: false;

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div className="flex flex-row items-center gap-2 rounded-xs bg-gray-700/20 px-1 py-0.5 backdrop-blur-xs">
					<span className="w-16 shrink-0 text-right tabular-nums">
						{(nearLimit || atLimit) && (
							<HiExclamation
								className={cn(
									"mr-1 inline-block size-5 align-text-top text-yellow-400/90",
									atLimit && "text-orange-500/90",
								)}
							/>
						)}
						{quantity.toLocaleString("en-US", { style: "decimal" })}
					</span>
					<Image
						width={24}
						height={24}
						src={`https://bungie.net/${icon}`}
						alt={name}
						className="size-6 shrink-0"
					/>
					<span className="overflow-hidden text-ellipsis whitespace-nowrap">
						{name}
					</span>
				</div>
			</TooltipTrigger>
			<TooltipContent>
				<p>
					{name}: {quantity.toLocaleString("en-US", { style: "decimal" })} /{" "}
					{maxStackSize?.toLocaleString("en-US", { style: "decimal" }) ?? "∞"}
				</p>
			</TooltipContent>
		</Tooltip>
	);
}

export function Materials() {
	const { user } = useUser();

	const { data: materialDefinitions } = useItemDefinitions(ALL_MATERIAL_HASHES);

	const quantities = useMemo(() => {
		const totals = new Map<number, number>();
		if (!user) return totals;

		// Materials live in different buckets depending on the item, so total up
		// everything the profile returned instead of guessing which one holds what
		const sources = [
			user.inventories,
			user.currencies,
			...Object.values(user.characterInventories ?? {}),
		];

		sources.forEach((source) => {
			source?.items.forEach((item) => {
				if (!MATERIAL_HASHES.has(item.itemHash)) return;
				totals.set(
					item.itemHash,
					(totals.get(item.itemHash) ?? 0) + item.quantity,
				);
			});
		});

		return totals;
	}, [user]);

	if (quantities.size === 0) return null;

	return (
		<details className="group flex flex-col" open>
			<summary className="flex w-fit cursor-pointer list-none flex-row items-center gap-2 rounded-t border-b border-gray-300/30 bg-gray-700/20 px-2 py-1 backdrop-blur-xs">
				<HiChevronDown className="size-5 shrink-0 transition-transform group-open:rotate-180" />
				<h4 className="glow text-xl font-medium">Material Counts</h4>
			</summary>

			<div className="mt-3 flex flex-col gap-2">
				{items.materials.map((group, index) => {
					const owned = group.filter((hash) => quantities.has(hash));
					if (owned.length === 0) return null;

					return (
						<div
							key={group[0]}
							className={cn(
								"grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2",
								index > 0 && "border-t border-gray-300/30 pt-2",
							)}
						>
							{owned.map((hash) => {
								const definition =
									materialDefinitions?.items[hash.toString(10)];
								if (!definition) return null;

								return (
									<MaterialCount
										key={hash}
										name={definition.displayProperties.name}
										icon={definition.displayProperties.icon}
										quantity={quantities.get(hash) ?? 0}
										maxStackSize={definition.inventory?.maxStackSize}
									/>
								);
							})}
						</div>
					);
				})}
			</div>
		</details>
	);
}
