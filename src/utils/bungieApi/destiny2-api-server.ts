import { BungieMembershipType, PlatformErrorCodes } from "bungie-api-ts/core";
import {
	DestinyComponentType,
	getLinkedProfiles,
	getProfile,
} from "bungie-api-ts/destiny2";
import { getMembershipDataForCurrentUser } from "bungie-api-ts/user";
import fs from "fs";

import { authenticatedHttpClient } from "./client";
import { getManifest, getSettings, getSlice } from "./destiny2-api-client";

export async function getInitialD2Info(save?: boolean) {
	const destinyManifest = await getManifest();
	const manifestTables = await getSlice(destinyManifest, [
		"DestinySeasonDefinition",
		"DestinyPresentationNodeDefinition",
	]);

	if (save) {
		const dir = "public/data";
		if (!fs.existsSync(dir)) fs.mkdirSync(dir);
		fs.writeFile(
			`${dir}/d2manifest.json`,
			JSON.stringify(destinyManifest),
			(err) => {
				if (err) throw err;
			},
		);
		fs.writeFile(
			`${dir}/seasoninfo.json`,
			JSON.stringify(manifestTables),
			(err) => {
				if (err) throw err;
			},
		);
	}

	const commonSettings = await getSettings();

	return {
		version: destinyManifest.version,
		allSeasons: manifestTables.DestinySeasonDefinition,
		commonSettings,
		presentationNodes: manifestTables.DestinyPresentationNodeDefinition,
	};
}

/**
 * AuthError means we have to log in again.
 */
export class AuthError extends Error {
	constructor(msg: string) {
		super(msg);
		this.name = "AuthError";
	}
}

export async function fetchUserProfileFromBungie(accessToken: string) {
	const currentUser = await getMembershipDataForCurrentUser((config) =>
		authenticatedHttpClient({
			...config,
			// @ts-expect-error: should work
			headers: { auth: accessToken },
		}),
	);
	// @ts-expect-error: const enums work
	if (currentUser.ErrorCode === PlatformErrorCodes.WebAuthRequired) {
		throw new AuthError(
			`(currentUser) ${currentUser.ErrorCode} - ${currentUser.ErrorStatus}: ${currentUser.Message}`,
		);
	}
	// @ts-expect-error: const enums work
	if (currentUser.ErrorCode !== PlatformErrorCodes.Success) {
		throw new Error(
			`(currentUser) ${currentUser.ErrorCode} - ${currentUser.ErrorStatus}: ${currentUser.Message}`,
		);
	}

	const linkedProfiles = await getLinkedProfiles(
		(config) =>
			authenticatedHttpClient({
				...config,
				// @ts-expect-error: should work
				headers: { auth: accessToken },
			}),
		{
			membershipId: currentUser.Response.bungieNetUser.membershipId,
			// @ts-expect-error: const enums work
			membershipType: BungieMembershipType.All,
			getAllMemberships: true,
		},
	);
	// @ts-expect-error: const enums work
	if (linkedProfiles.ErrorCode !== PlatformErrorCodes.Success) {
		throw new Error(
			`(linkedProfiles) ${linkedProfiles.ErrorCode} - ${linkedProfiles.ErrorStatus}: ${linkedProfiles.Message}`,
		);
	}

	const primaryProfile =
		linkedProfiles.Response.profiles.find(
			(profile) =>
				profile.membershipId === currentUser.Response.primaryMembershipId,
		) ?? linkedProfiles.Response.profiles[0];

	const detailedProfile = await getProfile(
		(config) =>
			authenticatedHttpClient({
				...config,
				// @ts-expect-error: should work
				headers: { auth: accessToken },
			}),
		{
			destinyMembershipId: primaryProfile.membershipId,
			membershipType: primaryProfile.membershipType,
			components: [
				// @ts-expect-error: const enums work
				DestinyComponentType.Profiles,
				// @ts-expect-error: const enums work
				DestinyComponentType.Characters,
			],
		},
	);
	// @ts-expect-error: const enums work
	if (detailedProfile.ErrorCode !== PlatformErrorCodes.Success) {
		throw new Error(
			`(detailedProfile) ${detailedProfile.ErrorCode} - ${detailedProfile.ErrorStatus}: ${detailedProfile.Message}`,
		);
	}

	return detailedProfile.Response;
}
