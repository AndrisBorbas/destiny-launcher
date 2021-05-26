import "@/styles/core.css";
import "@/styles/fonts.scss";
import "@/styles/components.scss";
import "@/styles/utilities.css";
import "@/styles/global.scss";

import type { AppProps, NextWebVitalsMetric } from "next/app";
import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";
import type { Workbox } from "workbox-window";

import * as gtag from "@/utils/gtag";

export function reportWebVitals({
	id,
	name,
	label,
	value,
}: NextWebVitalsMetric) {
	// Use `window.gtag` if you initialized Google Analytics as this example:
	// https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_document.js
	window.gtag("event", name, {
		event_category:
			label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
		value: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
		event_label: id, // id unique to current page load
		non_interaction: true, // avoids affecting bounce rate.
	});
}

export default function DLApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	useEffect(() => {
		const handleRouteChange = (url: string) => {
			gtag.pageview(url);
		};
		router.events.on("routeChangeComplete", handleRouteChange);
		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, [router.events]);

	useEffect(() => {
		window as Window & { workbox: Workbox } & typeof globalThis;
		if (
			typeof window !== "undefined" &&
			"serviceWorker" in navigator &&
			(window as Window & { workbox: Workbox } & typeof globalThis).workbox !==
				undefined
		) {
			const wb = (window as Window & { workbox: Workbox } & typeof globalThis)
				.workbox;
			// add event listeners to handle any of PWA lifecycle event
			// https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-window.Workbox#events
			wb.addEventListener("installed", (event) => {
				console.log(`Event ${event.type} is triggered.`);
				console.log(event);
			});

			wb.addEventListener("controlling", (event) => {
				console.log(`Event ${event.type} is triggered.`);
				console.log(event);
			});

			wb.addEventListener("activated", (event) => {
				console.log(`Event ${event.type} is triggered.`);
				console.log(event);
			});

			// A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
			// NOTE: MUST set skipWaiting to false in next.config.js pwa object
			// https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
			const promptNewVersionAvailable = (event: any) => {
				// `event.wasWaitingBeforeRegister` will be false if this is the first time the updated service worker is waiting.
				// When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is still waiting.
				// You may want to customize the UI prompt accordingly.
				if (
					// eslint-disable-next-line no-restricted-globals, no-alert
					confirm(
						"A newer version of this web app is available, reload to update?",
					)
				) {
					wb.addEventListener("controlling", () => {
						window.location.reload();
					});

					// Send a message to the waiting service worker, instructing it to activate.
					wb.messageSkipWaiting();
				} else {
					console.log(
						"User rejected to reload the web app, keep using old version. New version will be automatically load when user open the app next time.",
					);
				}
			};

			wb.addEventListener("waiting", promptNewVersionAvailable);

			// ISSUE - this is not working as expected, why?
			// I could only make message event listenser work when I manually add this listenser into sw.js file
			wb.addEventListener("message", (event) => {
				console.log(`Event ${event.type} is triggered.`);
				console.log(event);
			});

			/*
      wb.addEventListener('redundant', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })
      wb.addEventListener('externalinstalled', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })
      wb.addEventListener('externalactivated', event => {
        console.log(`Event ${event.type} is triggered.`)
        console.log(event)
      })
      */

			// never forget to call register as auto register is turned off in next.config.js
			wb.register();
		}
	}, []);

	return (
		<React.StrictMode>
			<Component {...pageProps} />
		</React.StrictMode>
	);
}
