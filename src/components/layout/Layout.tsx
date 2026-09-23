import { useMotionValue } from "framer-motion";
import { createRef, useEffect } from "react";

import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";
import { useLocalStorage } from "@/utils/hooks";

import { Background } from "./Background";
import styles from "./Layout.module.css";
import { SEO, type SEOProps } from "./SEO";

type LayoutProps = {
	buildDate?: number;
	seo?: SEOProps;
} & React.HTMLAttributes<HTMLDivElement>;

export function Layout({
	children,
	buildDate,
	seo,
	...restProps
}: LayoutProps) {
	const [bg, setBG] = useLocalStorage<boolean>("bg", true);

	return (
		<>
			<SEO {...seo} />

			<div id="app" className={styles.app}>
				{/* <motion.span
					className={styles.background}
					animate={{
						// @ts-expect-error: Variants work
						"--size-bottom": ["55%", "65%", "55%"],
						"--size-top": ["20%", "30%", "20%"],
					}}
					transition={{ duration: 17.7, repeat: Infinity }}
					aria-hidden="true"
				/> */}

				<Background enabled={bg} />

				<Navbar />

				<main id="main" {...restProps}>
					{children}
				</main>

				<Footer buildDate={buildDate} toggle={bg} setToggle={setBG} />
			</div>
		</>
	);
}
