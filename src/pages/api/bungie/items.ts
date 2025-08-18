import type { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { getDestinyEntityDefinition } from "bungie-api-ts/destiny2";
import type { NextApiRequest, NextApiResponse } from "next";

import { unauthenticatedHttpClient } from "@/utils/bungieApi/client";

export type ItemDefinitionsResponse = {
	items: { [hash: string]: DestinyInventoryItemDefinition };
	error?: string;
};

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ItemDefinitionsResponse>,
) => {
	switch (req.method) {
		case "POST": {
			try {
				const { hashes } = req.body as { hashes?: string[] | number[] };

				if (!hashes || !Array.isArray(hashes)) {
					res.status(400).json({
						items: {},
						error:
							"Invalid request body. Expected { hashes: string[] | number[] }",
					});
					return;
				}

				// Limit the number of items per request to prevent abuse
				if (hashes.length > 99) {
					res.status(400).json({
						items: {},
						error: "Too many items requested. Maximum 99 items per request.",
					});
					return;
				}

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
						console.warn(
							`Failed to fetch item definition for hash ${hash}:`,
							error,
						);
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

				res.status(200).json({ items });
				return;
			} catch (error) {
				console.error("Error fetching item definitions:", error);
				res.status(500).json({
					items: {},
					error: "Internal server error",
				});
				return;
			}
		}

		default: {
			res.setHeader("Allow", "POST");
			res.status(405).end();
			return;
		}
	}
};
