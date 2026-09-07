import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { getDestinyEntityDefinition } from "bungie-api-ts/destiny2";

import { unauthenticatedHttpClient } from "@/utils/bungieApi/client";

export const items = {
	silver: 3147280338,
	currencies: [
		2817410917, // Bright Dust
		4041218086, // Chronologs
		3159615086, // Glimmer
		// 2718300701, // Unstable Core
	],
	materials: [
		[
			3853748946, // Enhancement Core
			4257549984, // Enhancement Prism
			4257549985, // Ascendant Shard
			353704689, // Ascendant Alloy
			3467984096, // Exotic Cipher
			2228452164, // Deepsight Harmonizer
			3702027555, // Spoils of Conquest
			3282419336, // Raid Banner
		],
		[
			800069450, // Strange Coin
			402110270, // Legendary Mark
			3643918802, // Vanguard Cipher
			228647643, // Crucible Cipher
			3769435351, // Iron Cipher
			3397709326, // Osirion Cipher
			2884778147, // Fireteam Cipher
		],
		[
			1583786617, // Synthweave Template
			4019412287, // Synthweave Strap
			1498161294, // Synthweave Bolt
			4238733045, // Synthweave Plate
			3107195131, // Sleek Synthcord
			3552107018, // Plush Synthcord
			3855200273, // Rigid Synthcord
		],
		[
			3181091287, // Strange Signal
			2616412571, // Strange Matter
			228855596, // Deathmark
			3675783772, // Dark Matter Ingot
			589719184, // Credit
			4150228564, // Salvage
			2610515000, // Fated Cipher
			2217640604, // Quantum Substance (Word-Bearer)
			2217640605, // Quantum Substance (Assimilation Scout)
			2217640606, // Quantum Substance (Well of the Archon)
			2217640607, // Quantum Substance (Polus)
			3793612644, // Alkane Mutation
			3388913371, // Nine-Touched Relic Iron
			2367456861, // Phaseglass Refraction
			2174713383, // Timelost Spirit Bloom
			1289622079, // Strand Meditations
			1633854071, // Dark Fragment
			443031983, // Phantasmal Core
			443031982, // Phantasmal Fragment
			2993288448, // Herealways Piece
		],
		[
			2367713531, // Tincture of Queensfoil
			2473252800, // Unstable Charge of Light
			771273473, // Charge of Light - Tier 3
			810623803, // Charge of Light - Tier 2
			685299502, // Charge of Light - Tier 1
			1293574817, // Small Rice Cake
			1165306707, // Hymn of Desecration
			1471199156, // Terminal Overload Key
			1955791387, // Luminescent Seed
			805381928, // Memory Vestige: Light
			4116837065, // Memory Vestige: Darkness
		],
		[
			3788525515, // Exotic Requisition Order
			685157383, // Gunsmith Materials
			2979281381, // Upgrade Module
			1505278293, // Emperor Calus Token
			2512446424, // Nonary Manifold
			478751073, // Dusklight Cyrstal
			950899352, // Dusklight Shard
			461171930, // Alkane Spores
			2014411539, // Alkane Dust
			3756389242, // Phaseglass Spire
			1305274547, // Phaseglass Needle
			2949414982, // Quantized Datalattice
			3487922223, // Microphasic Datalattice
			49145143, // Simulation Seed
			685095924, // Harmonic Seraphite
			31293053, // Seraphite
			2834411056, // Etheric Helix
			1177810185, // Etheric Spiral
			4131980566, // Baryon Sapling
			592227263, // Baryon Bough
			3592324052, // Helium Filaments
			4114204995, // Ghost Fragments
			1485756901, // Glacial Starwort
			293622383, // Spinmetal Leaves
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
