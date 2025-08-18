export function oauthClientId(): string {
	if (process.env.NEXT_PUBLIC_BUNGIE_API_CLIENT_ID !== undefined)
		return process.env.NEXT_PUBLIC_BUNGIE_API_CLIENT_ID;
	return "";
	throw new Error("No Bungie API Client ID");
}

export function oauthClientAPIKey(): string {
	if (process.env.NEXT_PUBLIC_BUNGIE_API_KEY !== undefined)
		return process.env.NEXT_PUBLIC_BUNGIE_API_KEY;
	return "";
	throw new Error("No Bungie API Key");
}

export function oauthClientSecret(): string {
	if (process.env.BUNGIE_API_CLIENT_SECRET !== undefined)
		return process.env.BUNGIE_API_CLIENT_SECRET;
	return "";
	throw new Error("No Bungie API Client Secret");
}
