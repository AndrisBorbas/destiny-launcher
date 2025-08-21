import { getSanitizedPlatformDisplayNames } from "bungie-api-ts/user";
import Image from "next/image";
import { useMemo } from "react";
import { HiExclamation } from "react-icons/hi";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	ALL_CONSUMABLE_HASHES,
	ALL_CURRENCY_HASHES,
	items,
} from "@/utils/bungieApi/itemDefinitions";
import { getPlatformCode } from "@/utils/bungieApi/utils";
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

	const { data: consumableDefinitions } = useItemDefinitions(
		ALL_CONSUMABLE_HASHES,
	);

	const { data: currencyDefinitions } = useItemDefinitions(ALL_CURRENCY_HASHES);

	console.log(user);

	const currencyData = useMemo(() => {
		if (!user) return [];

		const data = new Map<number, CurrencyData>();

		if (user.inventories && consumableDefinitions) {
			user.inventories.items.forEach((item) => {
				const hash = item.itemHash.toString(10);
				const definition = consumableDefinitions.items[hash];
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				if (!definition) return;

				const key = item.itemHash as (typeof ALL_CONSUMABLE_HASHES)[number];

				const existing = data.get(key);
				if (existing) {
					existing.quantity += item.quantity;
				} else {
					data.set(key, {
						name: definition.displayProperties.name,
						icon: definition.displayProperties.icon,
						maxStackSize: definition.inventory?.maxStackSize,
						quantity: item.quantity,
					});
				}
			});
		}

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
			const indexA = (ALL_CONSUMABLE_HASHES as number[]).indexOf(a[0]);
			const indexB = (ALL_CONSUMABLE_HASHES as number[]).indexOf(b[0]);
			return indexA - indexB;
		});

		return array;
	}, [user, consumableDefinitions, currencyDefinitions]);

	return (
		<div className="grid grid-cols-[repeat(auto-fill,_8.5rem)] gap-4">
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
								{currency.name}: x
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
