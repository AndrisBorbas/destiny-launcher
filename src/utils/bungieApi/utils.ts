import {
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
