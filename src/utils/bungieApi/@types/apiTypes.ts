/**
 * An OAuth token, either authorization or refresh.
 */
export interface Token {
	/** The oauth token key */
	value: string;
	/** The token expires this many seconds after it is acquired. */
	expires: number;
	name: "access" | "refresh";
	/** A UTC epoch milliseconds timestamp representing when the token was acquired. */
	inception: number;
}

export interface Tokens {
	accessToken: Token;
	refreshToken?: Token;
	bungieMembershipId: string;
}
