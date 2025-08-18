import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { getDestinyEntityDefinition } from "bungie-api-ts/destiny2";

import { unauthenticatedHttpClient } from "@/utils/bungieApi/client";

export const items = {
	currencies: {
		important: [
			3853748946, // Enhancement Core
			3282419336, // Raid Banner
			4257549984, // Enhancement Prism
			3702027555, // Spoils of Conquest
			353704689, // Ascendant Alloy
			4257549985, // Ascendant Shard
			800069450, // Strange Coin
			3467984096, // Exotic Cipher
		],
		common: [
			1289622079, // Strand Meditation
			2610515000, // Fated Cipher
			2174713383, // Timelost Spirit Bloom
			3793612644, // Alkane Mutations
			3388913371, // Nine-Touched Relic Iron
			2367456861, // Phaseglass Refraction
		],
	},
} as const;

// Extract all item hashes from the items data
export const ALL_CURRENCY_HASHES = [
	...items.currencies.important,
	...items.currencies.common,
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
	return fetchItemDefinitionsServer(ALL_CURRENCY_HASHES);
}
