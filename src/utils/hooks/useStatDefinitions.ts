import type { DestinyStatDefinition } from "bungie-api-ts/destiny2";
import { useCallback, useState } from "react";
import useSWR from "swr";

import type { StatDefinitionsResponse } from "@/pages/api/bungie/stats";
import { authenticatedFetch } from "@/utils/api";

const statsRoute = "/api/bungie/stats";

// Cache for stat definitions to avoid refetching
const statCache = new Map<string, DestinyStatDefinition>();

// Pre-defined stat hashes from items.jsonc
export const STAT_HASHES = {
	HEALTH: 392767087,
	MELEE: 4244567218,
	GRENADE: 1735777505,
	SUPER: 144602215,
	CLASS: 1943323491,
	WEAPONS: 2996146975,
} as const;

// Array of all stat hashes for easy iteration
export const ALL_STAT_HASHES = Object.values(STAT_HASHES);

async function fetchStatDefinitions(
	hashes: (string | number)[],
): Promise<StatDefinitionsResponse> {
	// Filter out stats that are already cached
	const uncachedHashes = hashes.filter(
		(hash) => !statCache.has(hash.toString()),
	);

	if (uncachedHashes.length === 0) {
		// All stats are cached, return from cache
		const stats: { [hash: string]: DestinyStatDefinition } = {};
		hashes.forEach((hash) => {
			const cachedStat = statCache.get(hash.toString());
			if (cachedStat) {
				stats[hash.toString()] = cachedStat;
			}
		});
		return { stats };
	}

	const result = await authenticatedFetch<StatDefinitionsResponse>(statsRoute, {
		method: "POST",
		body: JSON.stringify({ hashes: uncachedHashes }),
	});

	// Cache the fetched stats
	Object.entries(result.stats).forEach(([hash, stat]) => {
		statCache.set(hash, stat);
	});

	// Combine cached and newly fetched stats
	const allStats: { [hash: string]: DestinyStatDefinition } = {};
	hashes.forEach((hash) => {
		const cachedStat = statCache.get(hash.toString());
		if (cachedStat) {
			allStats[hash.toString()] = cachedStat;
		}
	});

	return { stats: allStats, error: result.error };
}

/**
 * Hook to fetch stat definitions for specific hashes
 * @param hashes Array of stat hashes to fetch
 * @returns SWR response with stat definitions
 */
export function useStatDefinitions(hashes: (string | number)[] = []) {
	const uniqueHashes = [...new Set(hashes.filter((hash) => hash))];
	const hashKey =
		uniqueHashes.length > 0 ? uniqueHashes.sort().join(",") : null;

	return useSWR(
		hashKey ? [statsRoute, hashKey] : null,
		() => fetchStatDefinitions(uniqueHashes),
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			dedupingInterval: 300000, // 5 minutes
		},
	);
}

/**
 * Hook to fetch all predefined stat definitions
 * This fetches all 6 fixed stat definitions and caches them
 * @returns SWR response with all stat definitions
 */
export function useAllStatDefinitions() {
	return useStatDefinitions(ALL_STAT_HASHES);
}

/**
 * Hook to fetch stat definitions on demand
 * @returns Function to fetch stats and current state
 */
export function useStatDefinitionsFetcher() {
	const [data, setData] = useState<StatDefinitionsResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchStats = useCallback(async (hashes: (string | number)[]) => {
		if (hashes.length === 0) return;

		setLoading(true);
		setError(null);

		try {
			const result = await fetchStatDefinitions(hashes);
			setData(result);
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		data,
		loading,
		error,
		fetchStats,
	};
}

/**
 * Get cached stat definition if available
 * @param hash Stat hash
 * @returns Cached stat definition or null
 */
export function getCachedStatDefinition(
	hash: string | number,
): DestinyStatDefinition | null {
	return statCache.get(hash.toString()) ?? null;
}

/**
 * Preload stat definitions into cache
 * @param hashes Array of stat hashes
 */
export async function preloadStatDefinitions(hashes: (string | number)[]) {
	try {
		await fetchStatDefinitions(hashes);
	} catch (error) {
		console.warn("Failed to preload stat definitions:", error);
	}
}

/**
 * Preload all predefined stat definitions into cache
 * This is useful to call early in the app lifecycle to cache all stats
 */
export async function preloadAllStatDefinitions() {
	return preloadStatDefinitions(ALL_STAT_HASHES);
}

/**
 * Get a specific stat definition by its known hash
 * @param statType The stat type from STAT_HASHES
 * @returns Cached stat definition or null
 */
export function getStatDefinition(
	statType: keyof typeof STAT_HASHES,
): DestinyStatDefinition | null {
	return getCachedStatDefinition(STAT_HASHES[statType]);
}

/**
 * Populate the cache with stat definitions (useful for server-side preloading)
 * @param stats Object with stat definitions keyed by hash
 */
export function populateStatCache(stats: { [hash: string]: DestinyStatDefinition }) {
	Object.entries(stats).forEach(([hash, stat]) => {
		statCache.set(hash, stat);
	});
}
