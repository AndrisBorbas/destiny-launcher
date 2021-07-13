export const GTM_ID = "GTM-P39BGT3";

export const GTMPageView = (url: string) => {
	interface PageEventProps {
		event: string;
		page: string;
	}

	const pageEvent: PageEventProps = {
		event: "pageview",
		page: url,
	};

	// @ts-expect-error: Should work
	if (window && window.dataLayer) window.dataLayer.push(pageEvent);
	return pageEvent;
};
