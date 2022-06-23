import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import type { InfoResponse } from "@/pages/api/bungie/info";
import type { ProfileResponse } from "@/pages/api/bungie/profile";

export const d2InfoRoute = "/api/bungie/info";
export const d2InfoKey = "d2manifest";
/**
 * Fetch from "/api/bungie/info"
 * @returns manifest info
 */
export function useD2Info(fallbackData?: InfoResponse) {
	return useSWR<InfoResponse>(d2InfoRoute, {
		onError() {
			localStorage.removeItem(d2InfoKey);
		},
		onSuccess(data) {
			localStorage.setItem(d2InfoKey, JSON.stringify(data));
		},
		fallbackData,
	});
}

export const d2UserRoute = "/api/bungie/profile";
export const d2UserKey = "d2User";
/**
 * Fetch from "/api/bungie/profile"
 * @returns profile and character info
 */
export function useUser(redirectTo?: string, redirectIfLoggedIn = false) {
	const router = useRouter();
	const { data, error, isValidating, mutate } = useSWR<ProfileResponse>(
		d2UserRoute,
		{
			onError() {
				localStorage.removeItem(d2UserKey);
			},
			onSuccess(loadedData) {
				localStorage.setItem(d2UserKey, JSON.stringify(loadedData));
			},
		},
	);
	useEffect(() => {
		if (!redirectTo || !data) return;

		if (
			(!redirectIfLoggedIn && !data.profile) ||
			(redirectIfLoggedIn && data.profile)
		) {
			router.replace(redirectTo);
		}
	}, [router, data, redirectTo, redirectIfLoggedIn]);

	return {
		user: data && {
			profile: data.profile,
			characters: data.characters,
			clan: data.clan,
		},
		error: data?.error,
		isLoading: !error && !data,
		isValidating,
		mutateUser: mutate,
	};
}

// https://gist.github.com/kyleshevlin/08a2deb904b79077e46966567ccabf06
export function useBool(initialState = false): [
	boolean,
	{
		setTrue: () => void;
		setFalse: () => void;
		toggle: () => void;
		reset: () => void;
	},
] {
	const [state, setState] = useState(initialState);

	// Instead of individual React.useCallbacks gathered into an object
	// Let's memoize the whole object. Then, we can destructure the
	// methods we need in our consuming component.
	const handlers = useMemo(
		() => ({
			setTrue: () => {
				setState(true);
			},
			setFalse: () => {
				setState(false);
			},
			toggle: () => {
				setState((s) => !s);
			},
			reset: () => {
				setState(initialState);
			},
		}),
		[initialState],
	);

	return [state, handlers];
}

export function useLocalStorage<T>(key: string, initialValue: T) {
	// State to store our value
	// Pass initial state function to useState so logic is only executed once
	const [storedValue, setStoredValue] = useState<T>(() => {
		if (typeof window === "undefined") {
			console.warn("No window yet in useLocalStorage");
			return initialValue;
		}
		try {
			console.log("init");
			// Get from local storage by key
			const item = window.localStorage.getItem(key);
			// Parse stored json or if none return initialValue
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			// If error also return initialValue
			console.error(error);
			return initialValue;
		}
	});
	// Return a wrapped version of useState's setter function that ...
	// ... persists the new value to localStorage.
	const setValue = (value: T | ((val: T) => T)) => {
		if (typeof window === "undefined") {
			console.warn("No window yet in useLocalStorage");
			return;
		}
		try {
			console.log("save");
			// Allow value to be a function so we have same API as useState
			const valueToStore =
				value instanceof Function ? value(storedValue) : value;
			// Save state
			setStoredValue(valueToStore);
			// Save to local storage
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			// A more advanced implementation would handle the error case
			console.error(error);
		}
	};
	return [storedValue, setValue] as const;
}
