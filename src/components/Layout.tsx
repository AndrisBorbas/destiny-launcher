import Head from "next/head";

import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";

import styles from "./Layout.module.scss";

export default function Layout({
	children,
	...restProps
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
	return (
		<>
			<Head>
				<title>Destiny Launcher</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta
					name="description"
					content="Destiny Launcher aims to be a launcher for the websites
					made around Destiny and its public api. It presents the numerous
					websites for new players to explore and makes them easily accessible
					from one place, for everyone."
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Destiny Launcher" />
				<meta
					name="twitter:description"
					content="Destiny Launcher aims to be a launcher for the websites
					made around Destiny and its public api. It presents the numerous
					websites for new players to explore and makes them easily accessible
					from one place, for everyone."
				/>
				<meta
					name="twitter:image"
					content="https://destinylauncher.net/preview.png"
				/>
				<meta
					name="thumbnail"
					content="https://destinylauncher.net/preview.png"
				/>
				<meta
					property="og:image"
					content="https://destinylauncher.net/preview.png"
				/>
				<meta property="og:title" content="Destiny Launcher" />
				<meta
					property="og:description"
					content="Destiny Launcher aims to be a launcher for the websites
					made around Destiny and its public api. It presents the numerous
					websites for new players to explore and makes them easily accessible
					from one place, for everyone."
				/>
				<meta property="og:url" content="https://destinylauncher.net" />
				<meta property="og:type" content="website" />
				<link
					rel="apple-touch-icon"
					sizes="60x60"
					href="/apple-touch-icon-60x60.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="76x76"
					href="/apple-touch-icon-76x76.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="120x120"
					href="/apple-touch-icon-120x120.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="152x152"
					href="/apple-touch-icon-152x152.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon-180x180.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#161627" />
				<meta name="apple-mobile-web-app-title" content="Destiny Launcher" />
				<meta name="application-name" content="Destiny Launcher" />
				<meta name="msapplication-TileColor" content="#161627" />
				<meta name="theme-color" content="#161627" />

				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="format-detection" content="telephone=no" />
				<link rel="manifest" href="/manifest.json" />
				<link rel="shortcut icon" href="/favicon.ico" />
			</Head>

			<div id="app" className={styles.app}>
				<Navbar />

				<main id="#" {...restProps}>
					{children}
				</main>

				<Footer />
			</div>
		</>
	);
}
