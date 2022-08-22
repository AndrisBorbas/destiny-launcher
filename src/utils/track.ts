export function trackEvent(eventName: string, data: object, url?: string) {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (typeof global.umami?.trackEvent === "function") {
		// @ts-expect-error: Umami changed to objects in v1.37.0
		global.umami.trackEvent(eventName, data, url);
		if (process.env.NODE_ENV !== "production") {
			console.log(`Tracking event: ${eventName}, `, data);
		}
	} else if (process.env.NODE_ENV !== "production") {
		console.error("umami undefined");
	}
}
