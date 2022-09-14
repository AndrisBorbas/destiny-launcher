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

export async function fetchUserProfileFromBungie(membershipId: string) {
	const currentUser = await getMembershipDataById(authenticatedHttpClient, {
		membershipId,
		membershipType: BungieMembershipType.BungieNext,
	});

	if (
		currentUser.ErrorCode === PlatformErrorCodes.AccessTokenHasExpired ||
		currentUser.ErrorCode === PlatformErrorCodes.WebAuthRequired ||
		// (also means the access token has expired)
		currentUser.ErrorCode === PlatformErrorCodes.WebAuthModuleAsyncFailed ||
		currentUser.ErrorCode === PlatformErrorCodes.AuthorizationRecordRevoked ||
		currentUser.ErrorCode === PlatformErrorCodes.AuthorizationRecordExpired ||
		currentUser.ErrorCode === PlatformErrorCodes.AuthorizationCodeStale ||
		currentUser.ErrorCode === PlatformErrorCodes.AuthorizationCodeInvalid
	) {
		throw new AuthError(
			`(currentUser) ${currentUser.ErrorCode} - ${currentUser.ErrorStatus}: ${currentUser.Message}`,
		);
	}

	if (currentUser.ErrorCode !== PlatformErrorCodes.Success) {
		throw new Error(
			`(currentUser) ${currentUser.ErrorCode} - ${currentUser.ErrorStatus}: ${currentUser.Message}`,
		);
	}

	const linkedProfiles = await getLinkedProfiles(authenticatedHttpClient, {
		membershipId: currentUser.Response.bungieNetUser.membershipId,

		membershipType: BungieMembershipType.All,
		getAllMemberships: true,
	});

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
			DestinyComponentType.Profiles,

			DestinyComponentType.Characters,
		],
	});

	if (detailedProfile.ErrorCode !== PlatformErrorCodes.Success) {
		throw new Error(
			`(detailedProfile) ${detailedProfile.ErrorCode} - ${detailedProfile.ErrorStatus}: ${detailedProfile.Message}`,
		);
	}

	const clan = await getGroupsForMember(authenticatedHttpClient, {
		filter: GroupsForMemberFilter.All,

		groupType: GroupType.Clan,
		membershipId:
			detailedProfile.Response.profile.data?.userInfo.membershipId ?? "",
		membershipType:
			detailedProfile.Response.profile.data?.userInfo.membershipType ??
			BungieMembershipType.All,
	});

	if (clan.ErrorCode !== PlatformErrorCodes.Success) {
		// eslint-disable-next-line no-console
		console.error(new Error("Could not get clan info"));
	}

	return { user: detailedProfile.Response, clan: clan.Response };
}
