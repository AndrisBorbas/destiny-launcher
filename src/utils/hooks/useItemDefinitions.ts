import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { useCallback, useState } from "react";
import useSWR from "swr";

import type { ItemDefinitionsResponse } from "@/pages/api/bungie/items";

const itemsRoute = "/api/bungie/items";

// Cache for item definitions to avoid refetching
const itemCache = new Map<string, DestinyInventoryItemDefinition>();

async function fetchItemDefinitions(
	hashes: (string | number)[],
): Promise<ItemDefinitionsResponse> {
	// Filter out items that are already cached
	const uncachedHashes = hashes.filter(
		(hash) => !itemCache.has(hash.toString()),
	);

	if (uncachedHashes.length === 0) {
		// All items are cached, return from cache
		const items: { [hash: string]: DestinyInventoryItemDefinition } = {};
		hashes.forEach((hash) => {
			const cachedItem = itemCache.get(hash.toString());
			if (cachedItem) {
				items[hash.toString()] = cachedItem;
			}
		});
		return { items };
	}

	const response = await fetch(itemsRoute, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ hashes: uncachedHashes }),
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch item definitions: ${response.statusText}`);
	}

	const result = (await response.json()) as ItemDefinitionsResponse;

	// Cache the fetched items
	Object.entries(result.items).forEach(([hash, item]) => {
		itemCache.set(hash, item);
	});

	// Combine cached and newly fetched items
	const allItems: { [hash: string]: DestinyInventoryItemDefinition } = {};
	hashes.forEach((hash) => {
		const cachedItem = itemCache.get(hash.toString());
		if (cachedItem) {
			allItems[hash.toString()] = cachedItem;
		}
	});

	return { items: allItems, error: result.error };
}

/**
 * Hook to fetch item definitions for specific hashes
 * @param hashes Array of item hashes to fetch
 * @returns SWR response with item definitions
 */
export function useItemDefinitions(hashes: (string | number)[] = []) {
	const uniqueHashes = [...new Set(hashes.filter((hash) => hash))];
	const hashKey =
		uniqueHashes.length > 0 ? uniqueHashes.sort().join(",") : null;
	const shouldFetch = hashKey && hashKey !== "0";

	return useSWR(
		shouldFetch ? [itemsRoute, hashKey] : null,
		() => fetchItemDefinitions(uniqueHashes),
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			dedupingInterval: 300000, // 5 minutes
		},
	);
}

/**
 * Hook to fetch item definitions on demand
 * @returns Function to fetch items and current state
 */
export function useItemDefinitionsFetcher() {
	const [data, setData] = useState<ItemDefinitionsResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchItems = useCallback(async (hashes: (string | number)[]) => {
		if (hashes.length === 0) return;

		setLoading(true);
		setError(null);

		try {
			const result = await fetchItemDefinitions(hashes);
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
		fetchItems,
	};
}

/**
 * Get cached item definition if available
 * @param hash Item hash
 * @returns Cached item definition or null
 */
export function getCachedItemDefinition(
	hash: string | number,
): DestinyInventoryItemDefinition | null {
	return itemCache.get(hash.toString()) ?? null;
}

/**
 * Preload item definitions into cache
 * @param hashes Array of item hashes
 */
export async function preloadItemDefinitions(hashes: (string | number)[]) {
	try {
		await fetchItemDefinitions(hashes);
	} catch (error) {
		console.warn("Failed to preload item definitions:", error);
	}
}

/**
 * Populate the cache with item definitions (useful for server-side preloading)
 * @param items Object with item definitions keyed by hash
 */
export function populateItemCache(items: {
	[hash: string]: DestinyInventoryItemDefinition;
}) {
	Object.entries(items).forEach(([hash, item]) => {
		itemCache.set(hash, item);
	});
}
