import type { DestinyRecordDefinition } from "bungie-api-ts/destiny2";
import { getDestinyEntityDefinition } from "bungie-api-ts/destiny2";
import type { NextApiRequest, NextApiResponse } from "next";

import { unauthenticatedHttpClient } from "@/utils/bungieApi/client";

export type RecordDefinitionsResponse = {
	records: { [hash: string]: DestinyRecordDefinition };
	error?: string;
};

export default async (
	req: NextApiRequest,
	res: NextApiResponse<RecordDefinitionsResponse>,
) => {
	switch (req.method) {
		case "POST": {
			try {
				const { hashes } = req.body as { hashes?: string[] | number[] };

				if (!hashes || !Array.isArray(hashes)) {
					res.status(400).json({
						records: {},
						error:
							"Invalid request body. Expected { hashes: string[] | number[] }",
					});
					return;
				}

				// Limit the number of records per request to prevent abuse
				if (hashes.length > 50) {
					res.status(400).json({
						records: {},
						error:
							"Too many records requested. Maximum 50 records per request.",
					});
					return;
				}

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

				res.status(200).json({ records });
				return;
			} catch (error) {
				console.error("Error fetching record definitions:", error);
				res.status(500).json({
					records: {},
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
