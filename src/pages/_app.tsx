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

import { GTM_ID, GTMPageView } from "@/utils/gtm";

export default function DLApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	useEffect(() => {
		const handleRouteChange = (url: string) => GTMPageView(url);
		router.events.on("routeChangeComplete", handleRouteChange);
		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, []);

	return (
		<React.StrictMode>
			{/* Google Tag Manager */}
			<Script id="gtm" strategy="afterInteractive">
				{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
					new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
					j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
					'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
					})(window,document,'script','dataLayer','${GTM_ID}');`}
			</Script>
			{/* End Google Tag Manager */}
			{/* Google Tag Manager (noscript) */}
			<noscript
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{
					__html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
				}}
			/>
			{/* End Google Tag Manager (noscript) */}
			<SWRConfig
				value={{ fetcher: (url) => fetch(url).then((res) => res.json()) }}
			>
				<Component {...pageProps} />
			</SWRConfig>
		</React.StrictMode>
	);
}
