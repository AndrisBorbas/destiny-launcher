import type { HttpClient, HttpClientConfig } from "bungie-api-ts/http";

import { oauthClientAPIKey } from "./consts";

// I got this example from the DIM source code, because I couldn't manage to make it work on my own.
// https://github.com/DestinyItemManager/DIM/blob/master/src/app/bungie-api/http-client.ts#L139
function createHttpClient(
	fetchFunction: typeof fetch,
	apiKey: string,
	withCredentials: boolean,
	accessToken?: string,
): HttpClient {
	return async <Return>(config: HttpClientConfig) => {
		let { url } = config;
		if (config.params) {
			// strip out undefined params keys. bungie-api-ts creates them for optional endpoint parameters

			for (const key in config.params) {
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/no-dynamic-delete
				typeof config.params[key] === "undefined" && delete config.params[key];
			}

			url = `${url}?${new URLSearchParams(
				config.params as { [key: string]: string },
			).toString()}`;
		}

		const headers: { [key: string]: string } = {
			"X-API-Key": apiKey,
		};

		// Add OAuth authorization header if access token is provided
		if (accessToken) {
			headers.Authorization = `Bearer ${accessToken}`;
		}

		if (config.body) {
			headers["Content-Type"] = "application/json";
		}

		const fetchOptions = new Request(url, {
			method: config.method,
			body: config.body ? JSON.stringify(config.body) : undefined,
			headers,
			credentials: withCredentials ? "include" : "omit",
		});
		const response = await fetchFunction(fetchOptions);
		const data = (await response.json()) as Return;
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

// Create an authenticated client with an access token
export function authenticatedHttpClientWithToken(
	accessToken: string,
): HttpClient {
	return createHttpClient(fetch, oauthClientAPIKey(), false, accessToken);
}
