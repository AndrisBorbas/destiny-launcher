/**
 * Utility functions for making authenticated API requests with automatic token refresh
 */

export type ApiError = Error & {
	status?: number;
	statusText?: string;
};

/**
 * Makes an authenticated API request with automatic token refresh on 401 errors
 * @param url - The API endpoint URL
 * @param options - Fetch options
 * @returns Promise that resolves to the response data
 * @throws ApiError with status and statusText properties
 */
export async function authenticatedFetch<T = unknown>(
	url: string,
	options: RequestInit = {},
): Promise<T> {
	const makeRequest = async (
		requestUrl: string,
		requestOptions: RequestInit,
	) => {
		const response = await fetch(requestUrl, {
			...requestOptions,
			headers: {
				"Content-Type": "application/json",
				...(requestOptions.headers as { [key: string]: string }),
			},
		});

		if (response.ok) {
			return response.json() as Promise<T>;
		}

		const error = new Error(
			`Request failed: ${response.status} ${response.statusText}`,
		) as ApiError;
		error.status = response.status;
		error.statusText = response.statusText;
		throw error;
	};

	try {
		return await makeRequest(url, options);
	} catch (error) {
		// If we get a 401, try to refresh the token and retry
		if (
			error instanceof Error &&
			"status" in error &&
			(error as ApiError).status === 401
		) {
			try {
				const refreshResponse = await fetch("/api/auth/refresh", {
					method: "POST",
				});

				if (refreshResponse.ok) {
					// Token refresh succeeded, retry the original request
					return await makeRequest(url, options);
				} else {
					// Refresh failed, redirect to login
					if (typeof window !== "undefined") {
						window.location.href = "/api/auth/login";
					}
					throw new Error("Authentication expired and refresh failed");
				}
			} catch (_refreshError) {
				// Refresh failed, redirect to login
				if (typeof window !== "undefined") {
					window.location.href = "/api/auth/login";
				}
				throw new Error("Authentication expired and refresh failed");
			}
		}

		// Re-throw non-auth errors
		throw error;
	}
}

/**
 * Helper for making GET requests with authentication
 */
export function authenticatedGet<T = unknown>(url: string): Promise<T> {
	return authenticatedFetch<T>(url, { method: "GET" });
}

/**
 * Helper for making POST requests with authentication
 */
export function authenticatedPost<T = unknown>(
	url: string,
	data?: unknown,
): Promise<T> {
	return authenticatedFetch<T>(url, {
		method: "POST",
		body: data ? JSON.stringify(data) : undefined,
	});
}

/**
 * Helper for making PUT requests with authentication
 */
export function authenticatedPut<T = unknown>(
	url: string,
	data?: unknown,
): Promise<T> {
	return authenticatedFetch<T>(url, {
		method: "PUT",
		body: data ? JSON.stringify(data) : undefined,
	});
}

/**
 * Helper for making DELETE requests with authentication
 */
export function authenticatedDelete<T = unknown>(url: string): Promise<T> {
	return authenticatedFetch<T>(url, { method: "DELETE" });
}
