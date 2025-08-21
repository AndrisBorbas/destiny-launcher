import { useCallback, useState } from "react";
import useSWR, { type SWRConfiguration } from "swr";

import { authenticatedFetch } from "../api";

/**
 * SWR fetcher that uses authenticatedFetch for automatic token refresh
 */
export const authenticatedSWRFetcher = async <T>(url: string): Promise<T> => {
	return await authenticatedFetch<T>(url);
};

/**
 * Hook that provides authenticated SWR functionality with automatic token refresh
 * @param url - The API endpoint URL
 * @param config - SWR configuration options
 * @returns SWR response with authenticated fetching
 */
export function useAuthenticatedSWR<T = unknown, E = Error>(
	url: string | null,
	config?: SWRConfiguration<T, E>,
) {
	return useSWR<T, E>(url, url ? () => authenticatedSWRFetcher<T>(url) : null, {
		shouldRetryOnError: (err) => {
			// Don't retry on auth errors - let the fetcher handle the refresh
			if (err instanceof Error) {
				return !err.message.includes("Authentication expired");
			}
			return true;
		},
		...config,
	});
}

/**
 * Hook for making one-off authenticated API requests
 * @returns Object with fetch function and loading/error state
 */
export function useAuthenticatedFetch<T = unknown>() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = useCallback(
		async (url: string, options?: RequestInit): Promise<T | null> => {
			setLoading(true);
			setError(null);

			try {
				const result = await authenticatedFetch<T>(url, options);
				return result;
			} catch (err) {
				const apiError = err instanceof Error ? err : new Error(String(err));
				setError(apiError);
				return null;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return {
		fetchData,
		loading,
		error,
	};
}
