import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";

import type { InfoResponse } from "@/pages/api/bungie/info";
import type { ProfileResponse } from "@/pages/api/bungie/profile";

import { dlog } from "./utils";

// Export new authenticated hooks
export * from "./hooks/useAuthenticatedFetch";

export const d2InfoRoute = "/api/bungie/info";
export const d2InfoKey = "d2ManifestV2";
/**
 * Fetch from "/api/bungie/info"
 * @returns manifest info
 */
export function useD2Info(fallbackData?: InfoResponse) {
	return useSWR<InfoResponse, Error>(d2InfoRoute, {
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
export function useUser(redirectTo?: string, _redirectIfLoggedIn = false) {
	const _router = useRouter();
	const { data, error, mutate, isValidating } = useSWR<ProfileResponse, Error>(
		d2UserRoute,
		{
			onError(err) {
				localStorage.removeItem(d2UserKey);
				// If it's an auth error, the swrFetcher will handle the redirect
				// No need to handle it here as well
				console.error("User fetch error:", err);
			},
			onSuccess(loadedData) {
				localStorage.setItem(d2UserKey, JSON.stringify(loadedData));
			},
			// Don't retry on auth errors - let the fetcher handle the refresh
			shouldRetryOnError: (err) => {
				return !err.message.includes("Authentication expired");
			},
		},
	);
	// useEffect(() => {
	// 	if (!redirectTo || !data) return;

	// 	if ((!redirectIfLoggedIn && !error) || (redirectIfLoggedIn && error)) {
	// 		void router.replace(redirectTo);
	// 	}
	// }, [router, data, redirectTo, redirectIfLoggedIn, error]);

	return {
		user: data && {
			...data,
		},
		error,
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
			// console.warn("No window yet in useLocalStorage");
			return initialValue;
		}
		try {
			// Get from local storage by key
			const item = window.localStorage.getItem(key);
			// Parse stored json or if none return initialValue
			return item ? (JSON.parse(item) as T) : initialValue;
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
			// console.warn("No window yet in useLocalStorage");
			return;
		}
		try {
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

export function useEffectOnce(fn: () => void) {
	const ref = useRef(false);
	useEffect(() => {
		if (!ref.current) {
			fn();
		}
		return () => {
			ref.current = true;
		};
	}, [fn]);
}
