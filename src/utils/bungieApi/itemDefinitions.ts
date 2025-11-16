import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { getDestinyEntityDefinition } from "bungie-api-ts/destiny2";

import { unauthenticatedHttpClient } from "@/utils/bungieApi/client";

export const items = {
	silver: 3147280338,
	currencies: [
		3159615086, // Glimmer
		// 2718300701, // Unstable Core
		2817410917, // Bright Dust
		4041218086, // Chronologs
	],
	consumables: {
		important: [
			3853748946, // Enhancement Core
			4257549984, // Enhancement Prism
			4257549985, // Ascendant Shard
			353704689, // Ascendant Alloy
			3467984096, // Exotic Cipher
			800069450, // Strange Coin
			3282419336, // Raid Banner
			3702027555, // Spoils of Conquest
		],
		common: [
			2610515000, // Fated Cipher
			2174713383, // Timelost Spirit Bloom
			3793612644, // Alkane Mutations
			3388913371, // Nine-Touched Relic Iron
			2367456861, // Phaseglass Refraction
			1289622079, // Strand Meditation
		],
	},
} as const;

export const ALL_CURRENCY_HASHES = [items.silver, ...items.currencies];

export const ALL_CONSUMABLE_HASHES = [
	...items.consumables.important,
	...items.consumables.common,
];

export const ALL_ITEM_HASHES = [
	...ALL_CURRENCY_HASHES,
	...ALL_CONSUMABLE_HASHES,
];

/**
 * Server-side function to fetch item definitions directly
 * This bypasses the API route and can be used in getStaticProps/getServerSideProps
 * @param hashes Array of item hashes to fetch
 * @returns Object with item definitions
 */
export async function fetchItemDefinitionsServer(
	hashes: (string | number)[],
): Promise<{ [hash: string]: DestinyInventoryItemDefinition }> {
	const items: { [hash: string]: DestinyInventoryItemDefinition } = {};

	// Fetch all item definitions in parallel
	const fetchPromises = hashes.map(async (hash) => {
		try {
			const response = await getDestinyEntityDefinition(
				unauthenticatedHttpClient,
				{
					entityType: "DestinyInventoryItemDefinition",
					hashIdentifier: Number(hash),
				},
			);

			return {
				hash: hash.toString(),
				definition: response.Response as DestinyInventoryItemDefinition,
			};
		} catch (error) {
			console.warn(`Failed to fetch item definition for hash ${hash}:`, error);
			// Return null for failed items
			return null;
		}
	});

	// Wait for all requests to complete
	const results = await Promise.all(fetchPromises);

	// Process results and filter out failed requests
	results.forEach((result) => {
		if (result) {
			items[result.hash] = result.definition;
		}
	});

	return items;
}

/**
 * Server-side function to fetch all predefined item definitions from data/items.ts
 * This can be used in getStaticProps/getServerSideProps
 * @returns Object with all item definitions
 */
export async function fetchAllItemDefinitionsServer(): Promise<{
	[hash: string]: DestinyInventoryItemDefinition;
}> {
	return fetchItemDefinitionsServer(ALL_ITEM_HASHES);
}
