import type { DestinyStatDefinition } from "bungie-api-ts/destiny2";
import { getDestinyEntityDefinition } from "bungie-api-ts/destiny2";
import type { NextApiRequest, NextApiResponse } from "next";

import { unauthenticatedHttpClient } from "@/utils/bungieApi/client";

export type StatDefinitionsResponse = {
	stats: { [hash: string]: DestinyStatDefinition };
	error?: string;
};

export default async (
	req: NextApiRequest,
	res: NextApiResponse<StatDefinitionsResponse>,
) => {
	switch (req.method) {
		case "POST": {
			try {
				const { hashes } = req.body as { hashes?: string[] | number[] };

				if (!hashes || !Array.isArray(hashes)) {
					res.status(400).json({
						stats: {},
						error:
							"Invalid request body. Expected { hashes: string[] | number[] }",
					});
					return;
				}

				// Limit the number of stats per request to prevent abuse
				if (hashes.length > 20) {
					res.status(400).json({
						stats: {},
						error: "Too many stats requested. Maximum 20 stats per request.",
					});
					return;
				}

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
						console.warn(
							`Failed to fetch stat definition for hash ${hash}:`,
							error,
						);
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

				res.status(200).json({ stats });
				return;
			} catch (error) {
				console.error("Error fetching stat definitions:", error);
				res.status(500).json({
					stats: {},
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
