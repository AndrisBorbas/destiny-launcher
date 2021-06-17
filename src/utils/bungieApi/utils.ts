import {
	BungieMembershipType,
	DestinyCharacterComponent,
	DestinyClass,
} from "bungie-api-ts/destiny2";

/**
 * Transform an async function into a version that will only execute once at a time - if there's already
 * a version going, the existing promise will be returned instead of running it again.
 */
export function dedupePromise<T extends unknown[], K>(
	func: (...args: T) => Promise<K>,
): (...args: T) => Promise<K> {
	let promiseCache: Promise<K> | null = null;
	return async (...args: T) => {
		if (promiseCache) {
			return promiseCache;
		}
		promiseCache = func(...args);
		try {
			return await promiseCache;
		} finally {
			promiseCache = null;
		}
	};
}

export function currentCharacter(characters?: {
	[key: string]: DestinyCharacterComponent;
}): DestinyCharacterComponent | null {
	let current: DestinyCharacterComponent | null = null;
	if (characters) {
		Object.keys(characters).forEach((key) => {
			if (!current || characters[key].dateLastPlayed > current.dateLastPlayed) {
				current = characters[key];
			}
		});
	}
	return current;
}

export function getClass(p?: DestinyClass) {
	switch (p) {
		// @ts-expect-error: const enums work
		case DestinyClass.Titan: {
			return "Titan";
		}
		// @ts-expect-error: const enums work
		case DestinyClass.Hunter: {
			return "Hunter";
		}
		// @ts-expect-error: const enums work
		case DestinyClass.Warlock: {
			return "Warlock";
		}
		default:
			return "Guardian";
	}
}

/**
 * Get platform codes that sites use
 * @param m membershipType
 * @param codeType 0: 2 letter (report),
 * @returns platform code
 */
export function getPlatformCode(m?: BungieMembershipType, codeType = 0) {
	if (codeType === 0) {
		switch (m) {
			// @ts-expect-error: const enums work
			case BungieMembershipType.TigerXbox: {
				return "xb";
			}
			// @ts-expect-error: const enums work
			case BungieMembershipType.TigerPsn: {
				return "ps";
			}
			// @ts-expect-error: const enums work
			case BungieMembershipType.TigerSteam: {
				return "pc";
			}
			default:
				return "";
		}
	}
	return "";
}
