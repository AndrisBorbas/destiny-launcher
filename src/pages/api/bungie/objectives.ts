import type { DestinyObjectiveDefinition } from "bungie-api-ts/destiny2";
import { getDestinyEntityDefinition } from "bungie-api-ts/destiny2";
import type { NextApiRequest, NextApiResponse } from "next";

import { unauthenticatedHttpClient } from "@/utils/bungieApi/client";

export type ObjectiveDefinitionsResponse = {
	objectives: { [hash: string]: DestinyObjectiveDefinition };
	error?: string;
};

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ObjectiveDefinitionsResponse>,
) => {
	switch (req.method) {
		case "POST": {
			try {
				const { hashes } = req.body as { hashes?: string[] | number[] };

				if (!hashes || !Array.isArray(hashes)) {
					res.status(400).json({
						objectives: {},
						error:
							"Invalid request body. Expected { hashes: string[] | number[] }",
					});
					return;
				}

				// Limit the number of objectives per request to prevent abuse
				if (hashes.length > 99) {
					res.status(400).json({
						objectives: {},
						error:
							"Too many objectives requested. Maximum 99 objectives per request.",
					});
					return;
				}

				const objectives: { [hash: string]: DestinyObjectiveDefinition } = {};

				// Fetch all objective definitions in parallel
				const fetchPromises = hashes.map(async (hash) => {
					try {
						const response = await getDestinyEntityDefinition(
							unauthenticatedHttpClient,
							{
								entityType: "DestinyObjectiveDefinition",
								hashIdentifier: Number(hash),
							},
						);

						return {
							hash: hash.toString(),
							definition: response.Response as DestinyObjectiveDefinition,
						};
					} catch (error) {
						console.warn(
							`Failed to fetch objective definition for hash ${hash}:`,
							error,
						);
						// Return null for failed objectives
						return null;
					}
				});

				// Wait for all requests to complete
				const results = await Promise.all(fetchPromises);

				// Process results and filter out failed requests
				results.forEach((result) => {
					if (result) {
						objectives[result.hash] = result.definition;
					}
				});

				res.status(200).json({ objectives });
				return;
			} catch (error) {
				console.error("Error fetching objective definitions:", error);
				res.status(500).json({
					objectives: {},
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
