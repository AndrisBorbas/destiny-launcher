import { useCallback, useEffect, useState } from "react";

const FAVOURITES_KEY = "favouriteBanners";

// Global state to ensure all instances stay in sync
let globalFavourites: Set<string> | null = null;
const listeners = new Set<(favourites: Set<string>) => void>();

function loadFavouritesFromStorage(): Set<string> {
	if (typeof window === "undefined") {
		return new Set();
	}

	if (globalFavourites !== null) {
		return globalFavourites;
	}

	try {
		const jsonString = localStorage.getItem(FAVOURITES_KEY);
		if (jsonString) {
			const favouriteArray = JSON.parse(jsonString) as string[];
			globalFavourites = new Set(favouriteArray);
		} else {
			globalFavourites = new Set();
		}
	} catch (error) {
		console.warn("Failed to parse favourites from localStorage", error);
		globalFavourites = new Set();
	}

	return globalFavourites;
}

function saveFavouritesToStorage(favourites: Set<string>) {
	if (typeof window === "undefined") {
		return;
	}

	globalFavourites = new Set(favourites);
	const favouriteArray = Array.from(favourites);
	localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favouriteArray));

	// Notify all listeners
	listeners.forEach((listener) => {
		if (globalFavourites) {
			listener(globalFavourites);
		}
	});
}

export function useFavourites() {
	const [favourites, setFavourites] = useState<Set<string>>(() =>
		loadFavouritesFromStorage(),
	);

	useEffect(() => {
		// Initial load
		const currentFavourites = loadFavouritesFromStorage();
		setFavourites(currentFavourites);

		// Register listener for changes from other components
		const listener = (newFavourites: Set<string>) => {
			setFavourites(new Set(newFavourites));
		};
		listeners.add(listener);

		// Cleanup
		return () => {
			listeners.delete(listener);
		};
	}, []);

	const toggleFavourite = useCallback((bannerId: string) => {
		const currentFavourites = loadFavouritesFromStorage();
		const newFavourites = new Set(currentFavourites);

		if (newFavourites.has(bannerId)) {
			newFavourites.delete(bannerId);
		} else {
			newFavourites.add(bannerId);
		}

		saveFavouritesToStorage(newFavourites);
	}, []);

	const isFavourite = useCallback(
		(bannerId: string) => {
			return favourites.has(bannerId);
		},
		[favourites],
	);

	const addFavourite = useCallback((bannerId: string) => {
		const currentFavourites = loadFavouritesFromStorage();
		if (!currentFavourites.has(bannerId)) {
			const newFavourites = new Set(currentFavourites);
			newFavourites.add(bannerId);
			saveFavouritesToStorage(newFavourites);
		}
	}, []);

	const removeFavourite = useCallback((bannerId: string) => {
		const currentFavourites = loadFavouritesFromStorage();
		if (currentFavourites.has(bannerId)) {
			const newFavourites = new Set(currentFavourites);
			newFavourites.delete(bannerId);
			saveFavouritesToStorage(newFavourites);
		}
	}, []);

	return {
		favourites: Array.from(favourites),
		isFavourite,
		toggleFavourite: toggleFavourite,
		addFavourite,
		removeFavourite,
	};
}
