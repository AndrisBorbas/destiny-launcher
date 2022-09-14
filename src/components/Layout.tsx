import { motion } from "framer-motion";
import Head from "next/head";

import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";

import styles from "./Layout.module.scss";

type LayoutProps = {
	buildDate?: number;
} & React.HTMLAttributes<HTMLDivElement>;

export function Layout({
	children,
	buildDate,
	...restProps
}: LayoutProps): JSX.Element {
	return (
		<>
			<Head>
				<link rel="preconnect" href="https://vitals.vercel-insights.com" />
				<link rel="preconnect" href="https://succ.andrisborbas.com" />
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
					sizes="512x512"
					href="/favicon-512x512.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="192x192"
					href="/favicon-192x192.png"
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
				<meta name="color-scheme" content="dark light" />

				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="format-detection" content="telephone=no" />
				<link rel="manifest" href="/manifest.json" />
				{/* eslint-disable-next-line react/no-invalid-html-attribute */}
				<link rel="shortcut icon" href="/favicon-100x100.png" />
			</Head>

			<motion.div
				id="app"
				className={styles.app}
				animate={{
					// @ts-expect-error: Variants work
					"--size-bottom": ["55%", "65%", "55%"],
					"--size-top": ["20%", "30%", "20%"],
				}}
				transition={{ duration: 17.7, repeat: Infinity }}
			>
				<Navbar />

				<main id="#" {...restProps}>
					{children}
				</main>

				<Footer buildDate={buildDate} />
			</motion.div>
		</>
	);
}
