import type { Token, Tokens } from "./@types/apiTypes";
import { oauthClientId, oauthClientSecret } from "./consts";
import { dedupePromise } from "./utils";

const TOKEN_URL = "https://www.bungie.net/platform/app/oauth/token/";

function handleAccessToken(
	response:
		| {
				access_token: string;
				expires_in: number;
				membership_id: string;
				refresh_token?: string;
				refresh_expires_in: number;
		  }
		| undefined,
): Tokens {
	if (response?.access_token) {
		const data = response;
		const inception = Date.now();
		const accessToken: Token = {
			value: data.access_token,
			expires: data.expires_in,
			name: "access",
			inception,
		};

		const tokens: Tokens = {
			accessToken,
			bungieMembershipId: data.membership_id,
		};

		if (data.refresh_token) {
			tokens.refreshToken = {
				value: data.refresh_token,
				expires: data.refresh_expires_in,
				name: "refresh",
				inception,
			};
		}

		return tokens;
	}
	throw new Error(
		`No data or access token in response: ${JSON.stringify(response)}`,
	);
}

export function getAccessTokensFromCode(code: string): Promise<Tokens> {
	const body = new URLSearchParams({
		grant_type: "authorization_code",
		code,
		client_id: oauthClientId(),
		client_secret: oauthClientSecret(),
	});
	return Promise.resolve(
		fetch(TOKEN_URL, {
			method: "POST",
			body,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})
			.then((response) =>
				response.ok ? response.json() : Promise.reject(response),
			)
			.then(handleAccessToken),
	);
}

export const getAccessTokenFromRefreshToken = dedupePromise(
	(refreshToken: string): Promise<Tokens> => {
		const body = new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
			client_id: oauthClientId(),
			client_secret: oauthClientSecret(),
		});
		// https://github.com/zloirock/core-js/issues/178#issuecomment-192081350
		// ↑ we return fetch wrapped in an extra Promise.resolve so it has proper followup methods
		return Promise.resolve(
			fetch(TOKEN_URL, {
				method: "POST",
				body,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			})
				.then((response) =>
					response.ok ? response.json() : Promise.reject(response),
				)
				.then(handleAccessToken),
		);
	},
);
