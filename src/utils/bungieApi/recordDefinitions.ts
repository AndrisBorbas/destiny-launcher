import type { DestinyRecordDefinition } from "bungie-api-ts/destiny2";
import { getDestinyEntityDefinition } from "bungie-api-ts/destiny2";

import { unauthenticatedHttpClient } from "@/utils/bungieApi/client";

/**
 * Server-side function to fetch record definitions directly
 * This bypasses the API route and can be used in getStaticProps/getServerSideProps
 * @param hashes Array of record hashes to fetch
 * @returns Object with record definitions
 */
export async function fetchRecordDefinitionsServer(
	hashes: (string | number)[],
): Promise<{ [hash: string]: DestinyRecordDefinition }> {
	const records: { [hash: string]: DestinyRecordDefinition } = {};

	// Fetch all record definitions in parallel
	const fetchPromises = hashes.map(async (hash) => {
		try {
			const response = await getDestinyEntityDefinition(
				unauthenticatedHttpClient,
				{
					entityType: "DestinyRecordDefinition",
					hashIdentifier: Number(hash),
				},
			);

			return {
				hash: hash.toString(),
				definition: response.Response as DestinyRecordDefinition,
			};
		} catch (error) {
			console.warn(
				`Failed to fetch record definition for hash ${hash}:`,
				error,
			);
			// Return null for failed records
			return null;
		}
	});

	// Wait for all requests to complete
	const results = await Promise.all(fetchPromises);

	// Process results and filter out failed requests
	results.forEach((result) => {
		if (result) {
			records[result.hash] = result.definition;
		}
	});

	return records;
}
