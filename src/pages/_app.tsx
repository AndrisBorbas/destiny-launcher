import "@/styles/core.css";
import "@/styles/fonts.scss";
import "@/styles/components.scss";
import "@/styles/utilities.css";
import "@/styles/global.scss";

import type { AppProps } from "next/app";
import React from "react";

export default function DLApp({ Component, pageProps }: AppProps) {
	return (
		<React.StrictMode>
			<Component {...pageProps} />
		</React.StrictMode>
	);
}
