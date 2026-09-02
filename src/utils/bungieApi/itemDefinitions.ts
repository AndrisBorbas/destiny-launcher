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
	/** Material counts, grouped the way the game sorts them */
	materials: [
		[
			3853748946, // Enhancement Core
			4257549984, // Enhancement Prism
			353704689, // Ascendant Alloy
			4257549985, // Ascendant Shard
			2228452164, // Deepsight Harmonizer
			3467984096, // Exotic Cipher
		],
		[
			2993288448, // Herealways Piece
			443031982, // Phantasmal Fragment
			1633854071, // Dark Fragment
			2979281381, // Upgrade Module
		],
		[
			4150228564, // Salvage
			589719184, // Credit
			3675783772, // Dark Matter Ingot
			2616412571, // Strange Matter
			228855596, // Deathmark
			3769435351, // Iron Cipher
			402110270, // Legendary Mark
			3397709326, // Osirion Cipher
			3702027555, // Spoils of Conquest
			800069450, // Strange Coin
			3643918802, // Vanguard Cipher
			3181091287, // Strange Signal
			3282419336, // Raid Banner
		],
		[
			1498161294, // Synthweave Bolt
			4238733045, // Synthweave Plate
			4019412287, // Synthweave Strap
			1583786617, // Synthweave Template
			3552107018, // Plush Synthcord
			3855200273, // Rigid Synthcord
		],
		[
			3793612644, // Alkane Mutation
			3388913371, // Nine-Touched Relic Iron
			2367456861, // Phaseglass Refraction
			2174713383, // Timelost Spirit Bloom
			2217640604, // Quantum Substance (Word-Bearer)
			2217640605, // Quantum Substance (Assimilation Scout)
			2217640606, // Quantum Substance (Well of the Archon)
			2217640607, // Quantum Substance (Polus)
			2610515000, // Fated Cipher
			1289622079, // Strand Meditations
		],
	],
} as const;

export const buckets = {
	/** Quests & bounties, including seasonal "Active Orders" */
	quests: 635141261,
} as const;

export const ALL_CURRENCY_HASHES = [items.silver, ...items.currencies];

export const ALL_MATERIAL_HASHES: number[] = items.materials.flat();

export const MATERIAL_HASHES = new Set<number>(ALL_MATERIAL_HASHES);

export const ALL_ITEM_HASHES = [...ALL_CURRENCY_HASHES, ...ALL_MATERIAL_HASHES];

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
