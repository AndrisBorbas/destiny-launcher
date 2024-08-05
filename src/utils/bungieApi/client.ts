import type { ServerResponse } from "bungie-api-ts/destiny2";
import type { HttpClient, HttpClientConfig } from "bungie-api-ts/http";

import { oauthClientAPIKey } from "./consts";

// I got this example from the DIM source code, because I couldn't manage to make it work on my own.
// https://github.com/DestinyItemManager/DIM/blob/master/src/app/bungie-api/http-client.ts#L139
function createHttpClient(
	fetchFunction: typeof fetch,
	apiKey: string,
	withCredentials: boolean,
): HttpClient {
	return async (config: HttpClientConfig) => {
		let { url } = config;
		if (config.params) {
			// strip out undefined params keys. bungie-api-ts creates them for optional endpoint parameters
			/* eslint-disable guard-for-in, no-restricted-syntax */
			for (const key in config.params) {
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/no-dynamic-delete, no-param-reassign
				typeof config.params[key] === "undefined" && delete config.params[key];
			}
			/* eslint-enable guard-for-in, no-restricted-syntax */
			url = `${url}?${new URLSearchParams(
				config.params as { [key: string]: string },
			).toString()}`;
		}

		const fetchOptions = new Request(url, {
			method: config.method,
			body: config.body ? JSON.stringify(config.body) : undefined,
			headers: {
				"X-API-Key": apiKey,
				...(config.body && { "Content-Type": "application/json" }),
			},
			credentials: withCredentials ? "include" : "omit",
		});
		const response = await fetchFunction(fetchOptions);
		const data = await response.json();
		return data;
	};
}

export const unauthenticatedHttpClient = createHttpClient(
	fetch,
	oauthClientAPIKey(),
	false,
);

export const authenticatedHttpClient = createHttpClient(
	fetch,
	oauthClientAPIKey(),
	true,
);
