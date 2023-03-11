import { useMotionValue } from "framer-motion";
import { createRef, useEffect } from "react";

import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";
import { useLocalStorage } from "@/utils/hooks";

import { Background } from "./Background";
import styles from "./Layout.module.scss";
import { SEO } from "./SEO";

type LayoutProps = {
	buildDate?: number;
} & React.HTMLAttributes<HTMLDivElement>;

export function Layout({
	children,
	buildDate,
	...restProps
}: LayoutProps): JSX.Element {
	const [bg, setBG] = useLocalStorage<boolean>("bg", false);

	return (
		<>
			<SEO />

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

				<main id="#" {...restProps}>
					{children}
				</main>

				<Footer buildDate={buildDate} toggle={bg} setToggle={setBG} />
			</div>
		</>
	);
}
