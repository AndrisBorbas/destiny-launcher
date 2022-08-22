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

	return;

	if (typeof global.umami.trackEvent === "function") {
		// @ts-expect-error: Umami changed to objects in v1.37.0
		global.umami.trackEvent(eventName, data, url);
		if (process.env.NODE_ENV !== "production") {
			console.log(`Tracking event: ${eventName}, `, data);
		}
	} else if (process.env.NODE_ENV !== "production") {
		console.error("umami undefined");
	}
}
