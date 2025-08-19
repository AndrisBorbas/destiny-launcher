import type {
	DestinyCharacterComponent,
	DestinyRecordDefinition,
} from "bungie-api-ts/destiny2";
import { useCallback, useState } from "react";
import useSWR from "swr";

import type { RecordDefinitionsResponse } from "@/pages/api/bungie/records";

const recordsRoute = "/api/bungie/records";

// Cache for record definitions to avoid refetching
const recordCache = new Map<string, DestinyRecordDefinition>();

async function fetchRecordDefinitions(
	hashes: (string | number)[],
): Promise<RecordDefinitionsResponse> {
	// Filter out records that are already cached
	const uncachedHashes = hashes.filter(
		(hash) => !recordCache.has(hash.toString()),
	);

	if (uncachedHashes.length === 0) {
		// All records are cached, return from cache
		const records: { [hash: string]: DestinyRecordDefinition } = {};
		hashes.forEach((hash) => {
			const cachedRecord = recordCache.get(hash.toString());
			if (cachedRecord) {
				records[hash.toString()] = cachedRecord;
			}
		});
		return { records };
	}

	const response = await fetch(recordsRoute, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ hashes: uncachedHashes }),
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch record definitions: ${response.statusText}`,
		);
	}

	const result = (await response.json()) as RecordDefinitionsResponse;

	// Cache the fetched records
	Object.entries(result.records).forEach(([hash, record]) => {
		recordCache.set(hash, record);
	});

	// Combine cached and newly fetched records
	const allRecords: { [hash: string]: DestinyRecordDefinition } = {};
	hashes.forEach((hash) => {
		const cachedRecord = recordCache.get(hash.toString());
		if (cachedRecord) {
			allRecords[hash.toString()] = cachedRecord;
		}
	});

	return { records: allRecords, error: result.error };
}

/**
 * Hook to fetch record definitions for specific hashes
 * @param hashes Array of record hashes to fetch
 * @returns SWR response with record definitions
 */
export function useRecordDefinitions(hashes: (string | number)[] = []) {
	const uniqueHashes = [...new Set(hashes.filter((hash) => hash))];
	const hashKey =
		uniqueHashes.length > 0 ? uniqueHashes.sort().join(",") : null;

	return useSWR(
		hashKey ? [recordsRoute, hashKey] : null,
		() => fetchRecordDefinitions(uniqueHashes),
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			dedupingInterval: 300000, // 5 minutes
		},
	);
}

/**
 * Hook to fetch record definitions on demand
 * @returns Function to fetch records and current state
 */
export function useRecordDefinitionsFetcher() {
	const [data, setData] = useState<RecordDefinitionsResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchRecords = useCallback(async (hashes: (string | number)[]) => {
		if (hashes.length === 0) return;

		setLoading(true);
		setError(null);

		try {
			const result = await fetchRecordDefinitions(hashes);
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
		fetchRecords,
	};
}

/**
 * Get cached record definition if available
 * @param hash Record hash
 * @returns Cached record definition or null
 */
export function getCachedRecordDefinition(
	hash: string | number,
): DestinyRecordDefinition | null {
	return recordCache.get(hash.toString()) ?? null;
}

/**
 * Preload record definitions into cache
 * @param hashes Array of record hashes
 */
export async function preloadRecordDefinitions(hashes: (string | number)[]) {
	try {
		await fetchRecordDefinitions(hashes);
	} catch (error) {
		console.warn("Failed to preload record definitions:", error);
	}
}

/**
 * Populate the cache with record definitions (useful for server-side preloading)
 * @param records Object with record definitions keyed by hash
 */
export function populateRecordCache(records: {
	[hash: string]: DestinyRecordDefinition;
}) {
	Object.entries(records).forEach(([hash, record]) => {
		recordCache.set(hash, record);
	});
}

/**
 * Hook to fetch title record definitions from character titles
 * Extracts title record hashes from character data and fetches their definitions
 * @param characters Array of character objects that may have titleRecordHash
 * @returns SWR response with title record definitions
 */
export function useTitleRecordDefinitions(
	characters: { titleRecordHash?: number }[] = [],
) {
	const titleHashes = characters
		.map((char) => char.titleRecordHash)
		.filter((hash): hash is number => hash !== undefined && hash !== 0);

	return useRecordDefinitions(titleHashes);
}

/**
 * Get title text from a record definition
 * @param recordDefinition The record definition
 * @returns The title text or null if not available
 */
export function getTitleFromRecord(
	recordDefinition: DestinyRecordDefinition | null,
	character?: DestinyCharacterComponent,
): string | null {
	if (!recordDefinition?.titleInfo.titlesByGender) {
		return null;
	}

	const genderHash = character?.genderHash;
	if (genderHash) {
		const title = recordDefinition.titleInfo.titlesByGenderHash[genderHash];
		if (title) {
			return title;
		}
	}

	// Try to get the title text - usually the same for all genders
	const titles = recordDefinition.titleInfo.titlesByGender;

	// Try male first, then female, then any available
	return titles[0] || titles[1] || Object.values(titles)[0] || null;
}
