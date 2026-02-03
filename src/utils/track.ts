import { useEffect } from "react";
import * as Swetrix from "swetrix";

import { dlog } from "@/utils/utils";

export const TRACKING_ID = "4Yq2ku5S2eQB";

export function useSwetrix(
	pid: string = TRACKING_ID,
	initOptions: Swetrix.LibOptions = {
		apiURL: "https://succ.andrisborbas.com/backend/log",
	},
	pageViewsOptions: Swetrix.PageViewsOptions = {},
) {
	useEffect(() => {
		Swetrix.init(pid, initOptions);
		void Swetrix.trackViews(pageViewsOptions);
		// void Swetrix.trackErrors();
	}, [initOptions, pageViewsOptions, pid]);
};

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

export const getPayload = () => ({
	hostname: location.hostname,

	screen: `${screen.width}x${screen.height}`,
	language: navigator.language,

	url: `${location.pathname}${location.search}`,
});

export function trackEvent(
	eventName: string,
	data: { [key: string]: string | number | boolean | null | undefined },
	url?: string,
) {
	if (process.env.NODE_ENV !== "production") {
		dlog("trackEvent blocked: ", eventName, data, url, getPayload());
		return;
	}
	void Swetrix.track({
		...getPayload(),
		...{
			website: TRACKING_ID,
			url,
			ev: eventName,
			meta: data,
		},
	});
}
