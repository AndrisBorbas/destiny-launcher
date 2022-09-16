import { BungieMembershipType, PlatformErrorCodes } from "bungie-api-ts/core";
import {
	DestinyComponentType,
	getLinkedProfiles,
	getProfile,
} from "bungie-api-ts/destiny2";
import {
	getGroupsForMember,
	GroupsForMemberFilter,
	GroupType,
} from "bungie-api-ts/groupv2";
import { getMembershipDataById } from "bungie-api-ts/user";
import fs from "fs";

import { authenticatedHttpClient } from "./client";
import { getManifest, getSettings, getSlice } from "./destiny2-api-client";

export async function getInitialD2Info(save?: boolean) {
	const destinyManifest = await getManifest();
	const manifestTables = await getSlice(destinyManifest, [
		"DestinySeasonDefinition",
		"DestinyPresentationNodeDefinition",
	]);

	const presentationNodes = manifestTables.DestinyPresentationNodeDefinition;

	// Reduce size of data by removing unnecessary fields
	Object.entries(presentationNodes).forEach(([key, value]) => {
		Object.keys(value).forEach((subKey) => {
			if (!["displayProperties"].includes(subKey)) {
				// @ts-expect-error: it has the key because i used their keys
				// eslint-disable-next-line no-param-reassign
				delete value[subKey];
			}
			if (!value.displayProperties.name.toLowerCase().includes("season of")) {
				// @ts-expect-error: it has the key because i used their keys
				delete presentationNodes[key];
			}
		});
	});

	const commonSettings = await getSettings();

	if (save) {
		try {
			const dir = "public/data";
			if (!fs.existsSync(dir)) fs.mkdirSync(dir);
			fs.writeFile(
				`${dir}/d2Manifest.json`,
				JSON.stringify(destinyManifest),
				(err) => {
					if (err) throw err;
				},
			);
			fs.writeFile(
				`${dir}/seasonInfo.json`,
				JSON.stringify({
					DestinyPresentationNodeDefinition: presentationNodes,
					DestinySeasonDefinition: manifestTables.DestinySeasonDefinition,
				}),
				(err) => {
					if (err) throw err;
				},
			);
			fs.writeFile(
				`${dir}/commonSettings.json`,
				JSON.stringify(commonSettings),
				(err) => {
					if (err) throw err;
				},
			);
		} catch (e) {
			console.error(e);
		}
	}

	return {
		version: destinyManifest.version,
		allSeasons: manifestTables.DestinySeasonDefinition,
		destiny2CoreSettings: commonSettings.destiny2CoreSettings,
		presentationNodes,
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

export async function fetchUserProfileFromBungie(membershipId: string) {
	const currentUser = await getMembershipDataById(authenticatedHttpClient, {
		membershipId,
		// @ts-expect-error: Const enums work
		membershipType: BungieMembershipType.BungieNext,
	});

	if (
		// @ts-expect-error: Const enums work
		currentUser.ErrorCode === PlatformErrorCodes.AccessTokenHasExpired ||
		// @ts-expect-error: Const enums work
		currentUser.ErrorCode === PlatformErrorCodes.WebAuthRequired ||
		// (also means the access token has expired)
		// @ts-expect-error: Const enums work
		currentUser.ErrorCode === PlatformErrorCodes.WebAuthModuleAsyncFailed ||
		// @ts-expect-error: Const enums work
		currentUser.ErrorCode === PlatformErrorCodes.AuthorizationRecordRevoked ||
		// @ts-expect-error: Const enums work
		currentUser.ErrorCode === PlatformErrorCodes.AuthorizationRecordExpired ||
		// @ts-expect-error: Const enums work
		currentUser.ErrorCode === PlatformErrorCodes.AuthorizationCodeStale ||
		// @ts-expect-error: Const enums work
		currentUser.ErrorCode === PlatformErrorCodes.AuthorizationCodeInvalid
	) {
		throw new AuthError(
			`(currentUser) ${currentUser.ErrorCode} - ${currentUser.ErrorStatus}: ${currentUser.Message}`,
		);
	}
	// @ts-expect-error: Const enums work
	if (currentUser.ErrorCode !== PlatformErrorCodes.Success) {
		throw new Error(
			`(currentUser) ${currentUser.ErrorCode} - ${currentUser.ErrorStatus}: ${currentUser.Message}`,
		);
	}

	const linkedProfiles = await getLinkedProfiles(authenticatedHttpClient, {
		membershipId: currentUser.Response.bungieNetUser.membershipId,
		// @ts-expect-error: Const enums work
		membershipType: BungieMembershipType.All,
		getAllMemberships: true,
	});
	// @ts-expect-error: Const enums work
	if (linkedProfiles.ErrorCode !== PlatformErrorCodes.Success) {
		throw new Error(
			`(linkedProfiles) ${linkedProfiles.ErrorCode} - ${linkedProfiles.ErrorStatus}: ${linkedProfiles.Message}`,
		);
	}

	const primaryProfile =
		/* linkedProfiles.Response.profiles.find(
			(profile) =>
				profile.membershipId === currentUser.Response.primaryMembershipId,
		) ?? */
		linkedProfiles.Response.profiles.reduce((prev, curr) =>
			Date.parse(curr.dateLastPlayed) >= Date.parse(prev.dateLastPlayed)
				? curr
				: prev,
		);

	const detailedProfile = await getProfile(authenticatedHttpClient, {
		destinyMembershipId: primaryProfile.membershipId,
		membershipType: primaryProfile.membershipType,
		components: [
			// @ts-expect-error: Const enums work
			DestinyComponentType.Profiles,
			// @ts-expect-error: Const enums work
			DestinyComponentType.Characters,
		],
	});
	// @ts-expect-error: Const enums work
	if (detailedProfile.ErrorCode !== PlatformErrorCodes.Success) {
		throw new Error(
			`(detailedProfile) ${detailedProfile.ErrorCode} - ${detailedProfile.ErrorStatus}: ${detailedProfile.Message}`,
		);
	}

	const clan = await getGroupsForMember(authenticatedHttpClient, {
		// @ts-expect-error: Const enums work
		filter: GroupsForMemberFilter.All,
		// @ts-expect-error: Const enums work
		groupType: GroupType.Clan,
		membershipId:
			detailedProfile.Response.profile.data?.userInfo.membershipId ?? "",
		membershipType:
			detailedProfile.Response.profile.data?.userInfo.membershipType ??
			// @ts-expect-error: Const enums work
			BungieMembershipType.All,
	});
	// @ts-expect-error: Const enums work
	if (clan.ErrorCode !== PlatformErrorCodes.Success) {
		// eslint-disable-next-line no-console
		console.error(new Error("Could not get clan info"));
	}

	return { user: detailedProfile.Response, clan: clan.Response };
}
