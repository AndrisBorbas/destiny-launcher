import "@/styles/core.css";
import "@/styles/fonts.scss";
import "@/styles/components.scss";
import "@/styles/utilities.css";
import "@/styles/global.scss";

import type { AppProps, NextWebVitalsMetric } from "next/app";
import { useRouter } from "next/router";
import Script from "next/script";
import React, { useEffect } from "react";
import { SWRConfig } from "swr";

import { swrFetcher } from "@/utils/utils";

export default function DLApp({ Component, pageProps }: AppProps) {
	// const router = useRouter();
	// useEffect(() => {
	// 	router.events.on("routeChangeComplete", handleRouteChange);
	// 	return () => {
	// 		router.events.off("routeChangeComplete", handleRouteChange);
	// 	};
	// }, []);

	return (
		<React.StrictMode>
			{/* Umami analytics */}
			<Script
				async
				defer
				data-website-id="6dbdd14e-cbac-4d0e-8231-38d54549a3e2"
				src="https://analytics.andrisborbas.com/umami.js"
			/>
			{/* End Umami analytics */}

			<SWRConfig value={{ fetcher: swrFetcher }}>
				<Component {...pageProps} />
			</SWRConfig>
		</React.StrictMode>
	);
}
