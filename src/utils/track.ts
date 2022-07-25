export function trackEvent(
	eventValue: string,
	eventType: string,
	url?: string,
) {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (typeof global.umami?.trackEvent === "function") {
		global.umami.trackEvent(eventValue, eventType, url);
		if (process.env.NODE_ENV !== "production") {
			console.log(`Tracking event: ${eventValue}, {${eventType}}`);
		}
	} else if (process.env.NODE_ENV !== "production") {
		console.error("umami undefined");
	}
}
