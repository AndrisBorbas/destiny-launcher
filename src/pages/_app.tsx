import "@/styles/core.css";
import "@/styles/fonts.scss";
import "@/styles/components.scss";
import "@/styles/utilities.css";
import "@/styles/global.scss";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Script from "next/script";
import React from "react";
import { SWRConfig } from "swr";

import { useEffectOnce } from "@/utils/hooks";
import { TRACKING_ID } from "@/utils/track";
import { dlog, swrFetcher } from "@/utils/utils";

export default function DLApp({ Component, pageProps }: AppProps) {
	// const router = useRouter();
	// useEffectOnce(() => {
	// 	dlog(document.referrer, router.asPath);
	// 	trackView(document.referrer, router.asPath);
	// });

	return (
		<React.StrictMode>
			{/* Umami analytics */}
			{/* <Script
				async
				defer
				data-website-id={TRACKING_ID}
				src="https://succ.andrisborbas.com/succ.js"
				// data-auto-track="false"
			/> */}
			{/* End Umami analytics */}

			<SWRConfig value={{ fetcher: swrFetcher }}>
				<Component {...pageProps} />
			</SWRConfig>
		</React.StrictMode>
	);
}
