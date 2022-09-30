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
	const svgRef = createRef<SVGSVGElement>();
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	useEffect(() => {
		x.set(Math.random() * (window.innerWidth - 200) + 100);
		y.set(Math.random() * (window.innerHeight - 200) + 100);

		return () => {};
	}, []);

	function screenToSVG(sx: number, sy: number) {
		if (!svgRef.current) {
			return { x: 0, y: 0 };
		}
		const p = svgRef.current.createSVGPoint();
		p.x = sx;
		p.y = sy;
		return p.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
	}

	const [animate, setAnimate] = useLocalStorage<boolean>("animate", false);

	return (
		<>
			<SEO />

			<div
				id="app"
				className={styles.app}
				onMouseMove={(e) => {
					if (animate) {
						const p = screenToSVG(e.clientX, e.clientY);
						x.set(p.x);
						y.set(p.y);
					}
				}}
			>
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

				<Background mouseX={x} mouseY={y} svgRef={svgRef} />

				<Navbar />

				<main id="#" {...restProps}>
					{children}
				</main>

				<Footer
					buildDate={buildDate}
					animate={animate}
					setAnimate={setAnimate}
				/>
			</div>
		</>
	);
}
