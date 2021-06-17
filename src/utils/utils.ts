import type { NextApiRequest } from "next";

/**
 * Fetch with typed result
 * @param url fetch url
 * @returns result of fetch
 */
export function typedFetch<T>(url: string): Promise<T> {
	return fetch(url).then((response) => {
		if (!response.ok) {
			throw new Error(response.statusText);
		}
		return response.json() as Promise<T>;
	});
}

/**
 * Based on the environment and the request we know if a secure cookie can be set.
 * https://github.com/auth0/nextjs-auth0/blob/88959971958e5c6ed5bd874828c97363d2224f74/src/utils/cookies.ts
 */
export function isSecureEnvironment(req: NextApiRequest) {
	if (!req || !req.headers || !req.headers.host) {
		throw new Error('The "host" request header is not available');
	}

	if (process.env.NODE_ENV !== "production") {
		return false;
	}

	const host =
		(req.headers.host.indexOf(":") > -1 && req.headers.host.split(":")[0]) ||
		req.headers.host;
	if (["localhost", "127.0.0.1"].indexOf(host) > -1) {
		return false;
	}

	return true;
}
