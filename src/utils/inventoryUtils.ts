import type {
	DestinyInventoryItemDefinition,
	DestinyItemType,
	TierType,
} from "bungie-api-ts/destiny2";

import { preloadItemDefinitions } from "./hooks/useItemDefinitions";

/**
 * Utility functions for processing inventory data efficiently
 */

/**
 * Extract unique item hashes from inventory data
 * @param inventoryItems Array of inventory items
 * @returns Array of unique item hashes
 */
export function extractItemHashes(
	inventoryItems: { itemHash: number }[],
): number[] {
	return [...new Set(inventoryItems.map((item) => item.itemHash))];
}

/**
 * Group inventory items by bucket (category)
 * @param inventoryItems Array of inventory items with bucketHash
 * @returns Object with bucketHash as key and array of items as value
 */
export function groupItemsByBucket<T extends { bucketHash: number }>(
	inventoryItems: T[],
): { [bucketHash: number]: T[] } {
	return inventoryItems.reduce<{ [bucketHash: number]: T[] }>(
		(groups, item) => {
			const bucket = item.bucketHash;
			if (!(bucket in groups)) {
				groups[bucket] = [];
			}
			groups[bucket].push(item);
			return groups;
		},
		{},
	);
}

/**
 * Process inventory in chunks to avoid overwhelming the API
 * @param inventoryItems Array of inventory items
 * @param chunkSize Number of items to process per chunk (default: 50)
 * @returns Promise that resolves when all chunks are processed
 */
export async function preloadInventoryInChunks(
	inventoryItems: { itemHash: number }[],
	chunkSize = 50,
): Promise<void> {
	const uniqueHashes = extractItemHashes(inventoryItems);

	// Process in chunks
	for (let i = 0; i < uniqueHashes.length; i += chunkSize) {
		const chunk = uniqueHashes.slice(i, i + chunkSize);
		await preloadItemDefinitions(chunk);

		// Small delay between chunks to be respectful to the API
		if (i + chunkSize < uniqueHashes.length) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
	}
}

/**
 * Filter items by type using item definitions
 * @param items Array of items with definitions
 * @param predicate Function to filter items based on their definition
 * @returns Filtered array of items
 */
export function filterItemsByDefinition<T extends { itemHash: number }>(
	items: T[],
	itemDefinitions: { [hash: string]: DestinyInventoryItemDefinition },
	predicate: (definition: DestinyInventoryItemDefinition) => boolean,
): T[] {
	return items.filter((item) => {
		const definition = itemDefinitions[item.itemHash.toString()];
		return definition ? predicate(definition) : false;
	});
}

/**
 * Common item type filters
 */
export const ItemFilters = {
	weapons: (def: DestinyInventoryItemDefinition) =>
		def.itemType === (3 as DestinyItemType), // DestinyItemType.Weapon

	armor: (def: DestinyInventoryItemDefinition) =>
		def.itemType === (2 as DestinyItemType), // DestinyItemType.Armor

	consumables: (def: DestinyInventoryItemDefinition) =>
		def.itemType === (19 as DestinyItemType), // DestinyItemType.Consumable

	materials: (def: DestinyInventoryItemDefinition) =>
		def.itemType === (10 as DestinyItemType), // DestinyItemType.CurrencyExchange

	exotic: (def: DestinyInventoryItemDefinition) =>
		def.inventory?.tierType === (6 as TierType), // TierType.Exotic

	legendary: (def: DestinyInventoryItemDefinition) =>
		def.inventory?.tierType === (5 as TierType), // TierType.Superior

	rare: (def: DestinyInventoryItemDefinition) =>
		def.inventory?.tierType === (4 as TierType), // TierType.Rare
};

/**
 * Sort items by name using their definitions
 * @param items Array of items
 * @param itemDefinitions Record of item definitions
 * @returns Sorted array of items
 */
export function sortItemsByName<T extends { itemHash: number }>(
	items: T[],
	itemDefinitions: { [hash: string]: DestinyInventoryItemDefinition },
): T[] {
	return [...items].sort((a, b) => {
		const defA = itemDefinitions[a.itemHash.toString()];
		const defB = itemDefinitions[b.itemHash.toString()];

		const nameA = defA?.displayProperties?.name || `Hash-${a.itemHash}`;
		const nameB = defB?.displayProperties?.name || `Hash-${b.itemHash}`;

		return nameA.localeCompare(nameB);
	});
}

/**
 * Get item rarity color class based on tier type
 * @param definition Item definition
 * @returns CSS class name for rarity color
 */
export function getItemRarityClass(
	definition: DestinyInventoryItemDefinition,
): string {
	const tierType = definition.inventory?.tierType;
	switch (tierType) {
		case 6 as TierType:
			return "exotic"; // Exotic
		case 5 as TierType:
			return "legendary"; // Legendary
		case 4 as TierType:
			return "rare"; // Rare
		case 3 as TierType:
			return "uncommon"; // Uncommon
		case 2 as TierType:
			return "common"; // Common
		default:
			return "basic";
	}
}

/**
 * Check if item is stackable (has maxStackSize > 1)
 * @param definition Item definition
 * @returns True if item is stackable
 */
export function isStackableItem(
	definition: DestinyInventoryItemDefinition,
): boolean {
	return (definition.inventory?.maxStackSize ?? 1) > 1;
}
