import type { DestinyStatDefinition } from "bungie-api-ts/destiny2";
import { getDestinyEntityDefinition } from "bungie-api-ts/destiny2";

import { unauthenticatedHttpClient } from "@/utils/bungieApi/client";
import { ALL_STAT_HASHES } from "@/utils/hooks/useStatDefinitions";

/**
 * Server-side function to fetch stat definitions directly
 * This bypasses the API route and can be used in getStaticProps/getServerSideProps
 * @param hashes Array of stat hashes to fetch
 * @returns Object with stat definitions
 */
export async function fetchStatDefinitionsServer(
	hashes: (string | number)[],
): Promise<{ [hash: string]: DestinyStatDefinition }> {
	const stats: { [hash: string]: DestinyStatDefinition } = {};

	// Fetch all stat definitions in parallel
	const fetchPromises = hashes.map(async (hash) => {
		try {
			const response = await getDestinyEntityDefinition(
				unauthenticatedHttpClient,
				{
					entityType: "DestinyStatDefinition",
					hashIdentifier: Number(hash),
				},
			);

			return {
				hash: hash.toString(),
				definition: response.Response as DestinyStatDefinition,
			};
		} catch (error) {
			console.warn(`Failed to fetch stat definition for hash ${hash}:`, error);
			// Return null for failed stats
			return null;
		}
	});

	// Wait for all requests to complete
	const results = await Promise.all(fetchPromises);

	// Process results and filter out failed requests
	results.forEach((result) => {
		if (result) {
			stats[result.hash] = result.definition;
		}
	});

	return stats;
}

/**
 * Server-side function to fetch all predefined stat definitions
 * This can be used in getStaticProps/getServerSideProps
 * @returns Object with all stat definitions
 */
export async function fetchAllStatDefinitionsServer(): Promise<{
	[hash: string]: DestinyStatDefinition;
}> {
	return fetchStatDefinitionsServer(ALL_STAT_HASHES);
}
