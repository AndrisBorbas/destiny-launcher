export const TRACKING_ID = "29d1f3eb-69a8-4451-a1c9-9a9a67fcff1c";

export const assign = (a: any, b: any) => {
	Object.keys(b).forEach((key) => {
		// eslint-disable-next-line no-param-reassign
		if (b[key] !== undefined) a[key] = b[key];
	});
	return a;
};

// Should only be called in browser
export const getPayload = () => ({
	// eslint-disable-next-line no-restricted-globals
	hostname: location.hostname,
	// eslint-disable-next-line no-restricted-globals
	screen: `${screen.width}x${screen.height}`,
	language: navigator.language,
	// eslint-disable-next-line no-restricted-globals
	url: `${location.pathname}${location.search}`,
});

export function trackView(referrer?: string, url?: string) {
	fetch("/api/utils/view", {
		method: "POST",
		body: JSON.stringify({
			type: "pageview",
			payload: assign(getPayload(), {
				website: TRACKING_ID,
				url,
				referrer,
			}),
		}),
	});
}

export function trackEvent(eventName: string, data: object, url?: string) {
	fetch("/api/utils/event", {
		method: "POST",
		body: JSON.stringify({
			type: "event",
			payload: assign(getPayload(), {
				website: TRACKING_ID,
				url,
				event_name: eventName,
				event_data: data,
			}),
		}),
	});
}
