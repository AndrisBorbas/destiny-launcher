import type { DestinyObjectiveDefinition } from "bungie-api-ts/destiny2";
import useSWR from "swr";

import type { ObjectiveDefinitionsResponse } from "@/pages/api/bungie/objectives";
import { authenticatedFetch } from "@/utils/api";

const objectivesRoute = "/api/bungie/objectives";

// The api route only accepts a limited amount of hashes per request
const CHUNK_SIZE = 99;

// Cache for objective definitions to avoid refetching
const objectiveCache = new Map<string, DestinyObjectiveDefinition>();

async function fetchObjectiveDefinitions(
	hashes: (string | number)[],
): Promise<ObjectiveDefinitionsResponse> {
	// Filter out objectives that are already cached
	const uncachedHashes = hashes.filter(
		(hash) => !objectiveCache.has(hash.toString()),
	);

	let error: string | undefined;

	// Fetch the missing definitions in chunks the api route accepts
	for (let i = 0; i < uncachedHashes.length; i += CHUNK_SIZE) {
		const chunk = uncachedHashes.slice(i, i + CHUNK_SIZE);

		const result = await authenticatedFetch<ObjectiveDefinitionsResponse>(
			objectivesRoute,
			{
				method: "POST",
				body: JSON.stringify({ hashes: chunk }),
			},
		);

		// Cache the fetched objectives
		Object.entries(result.objectives).forEach(([hash, objective]) => {
			objectiveCache.set(hash, objective);
		});

		error ??= result.error;
	}

	// Combine cached and newly fetched objectives
	const allObjectives: { [hash: string]: DestinyObjectiveDefinition } = {};
	hashes.forEach((hash) => {
		const cachedObjective = objectiveCache.get(hash.toString());
		if (cachedObjective) {
			allObjectives[hash.toString()] = cachedObjective;
		}
	});

	return { objectives: allObjectives, error };
}

/**
 * Hook to fetch objective definitions for specific hashes
 * @param hashes Array of objective hashes to fetch
 * @returns SWR response with objective definitions
 */
export function useObjectiveDefinitions(hashes: (string | number)[] = []) {
	const uniqueHashes = [...new Set(hashes.filter((hash) => hash))];
	const hashKey =
		uniqueHashes.length > 0 ? uniqueHashes.sort().join(",") : null;

	return useSWR(
		hashKey ? [objectivesRoute, hashKey] : null,
		() => fetchObjectiveDefinitions(uniqueHashes),
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			dedupingInterval: 300000, // 5 minutes
		},
	);
}

/**
 * Get cached objective definition if available
 * @param hash Objective hash
 * @returns Cached objective definition or null
 */
export function getCachedObjectiveDefinition(
	hash: string | number,
): DestinyObjectiveDefinition | null {
	return objectiveCache.get(hash.toString()) ?? null;
}

/**
 * Populate the cache with objective definitions (useful for server-side preloading)
 * @param objectives Object with objective definitions keyed by hash
 */
export function populateObjectiveCache(objectives: {
	[hash: string]: DestinyObjectiveDefinition;
}) {
	Object.entries(objectives).forEach(([hash, objective]) => {
		objectiveCache.set(hash, objective);
	});
}
