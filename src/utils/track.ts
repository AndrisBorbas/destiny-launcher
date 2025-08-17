import { dlog } from "./utils";

export const TRACKING_ID = "553afec4-fa8d-402b-a0a4-e63a7dde35e4";

export const assign = (
	a: { [key: string]: unknown },
	b: { [key: string]: unknown },
) => {
	Object.keys(b).forEach((key) => {
		if (b[key] !== undefined) {
			a[key] = b[key];
		}
	});
	return a;
};

// Should only be called in browser
export const getPayload = () => ({
	hostname: location.hostname,

	screen: `${screen.width}x${screen.height}`,
	language: navigator.language,

	url: `${location.pathname}${location.search}`,
});

export function trackEvent(eventName: string, data: object, url?: string) {
	if (process.env.NODE_ENV !== "production") {
		dlog("trackEvent blocked: ", eventName, data, url, getPayload());
		return;
	}
	void fetch("/api/succ", {
		method: "POST",
		body: JSON.stringify({
			type: "event",
			payload: assign(getPayload(), {
				website: TRACKING_ID,
				url,
				name: eventName,
				data,
			}),
		}),
	});
}
