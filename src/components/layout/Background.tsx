import clsx from "clsx";
import type { MotionValue } from "framer-motion";
import { motion, useSpring } from "framer-motion";
import type { RefObject } from "react";

import styles from "./Background.module.scss";

export type BackgroundProps = {
	svgRef: RefObject<SVGSVGElement>;
	mouseX: MotionValue<number>;
	mouseY: MotionValue<number>;
	enabled: boolean;
};

// Original from https://twitter.com/laudis_io/status/1569750442703466496

export function Background({
	mouseX,
	mouseY,
	svgRef,
	enabled,
}: BackgroundProps) {
	const x = useSpring(mouseX, { stiffness: 70, damping: 7 });
	const y = useSpring(mouseY, { stiffness: 70, damping: 7 });

	return (
		<div className={styles.background}>
			<svg
				ref={svgRef}
				viewBox="0 0 1512 982"
				preserveAspectRatio="xMidYMid slice"
				height="100%"
				width="100%"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g clipPath="url(#bgClipPath)">
					<rect width="1512" height="982" fill="#161627" />
					<g filter="url(#bgFilter1)">
						<path
							d="M984 217.5C984 359 658.5 387.756 583 456.5C507.5 525.244 158.359 964 -19.5 964C-162.829 1141.33 -139 1008 -52.805 933.553C-174.626 933.553 -103.184 -0.252945 -103.184 -97.0044C-103.184 -193.756 355.031 -40.2318 476.852 -40.2318C763.466 -126.742 984 120.749 984 217.5Z"
							fill="#A390CE"
						/>
					</g>
					<g filter="url(#bgFilter2)">
						<ellipse
							cx="983.5"
							cy="-15.5"
							rx="332.5"
							ry="263.5"
							fill="#8EADD9"
						/>
					</g>

					<motion.g
						style={{
							x,
							y,
							mixBlendMode: "overlay",
						}}
						className={clsx(enabled ? "" : styles.backgroundBlob)}
						filter="url(#bgFilter3)"
					>
						<path
							d="M145.315 -7.65351C122.208 154.962 385.107 134.277 519.445 103.607C555.57 82.7502 509.545 -26.117 443.829 -95.7139C378.113 -165.311 548.881 -294.712 484.481 -387.158C420.081 -479.603 174.199 -210.923 145.315 -7.65351Z"
							fill="#F838CD"
						/>
						<path
							d="M233.221 -116.853C162.602 -177.782 -362.623 426.665 -182.463 523.08C-19.1196 610.495 401.825 195.226 451.222 153.295C512.968 100.882 321.496 -40.6913 233.221 -116.853Z"
							fill="#7A81BD"
						/>
						<path
							d="M98.7067 -164.626C43.8658 -288.255 -143.801 -301.321 -235.873 -301.321C-327.946 -301.321 -513.6 -280.817 -519.637 -198.8C-527.184 -96.2787 -414.484 -88.7404 -414.484 128.363C-414.484 345.467 -216.754 206.259 23.2375 206.259C215.231 206.259 153.548 -40.9977 98.7067 -164.626Z"
							fill="#F1972C"
						/>
					</motion.g>
				</g>
				<defs>
					<filter
						id="bgFilter1"
						x="-424"
						y="-429"
						width="1708"
						height="1780.99"
						filterUnits="userSpaceOnUse"
						colorInterpolationFilters="sRGB"
					>
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feBlend
							mode="normal"
							in="SourceGraphic"
							in2="BackgroundImageFix"
							result="shape"
						/>
						<feGaussianBlur stdDeviation="100" result="bgEffectBlur" />
					</filter>
					<filter
						id="bgFilter2"
						x="351"
						y="-579"
						width="1265"
						height="1127"
						filterUnits="userSpaceOnUse"
						colorInterpolationFilters="sRGB"
					>
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feBlend
							mode="normal"
							in="SourceGraphic"
							in2="BackgroundImageFix"
							result="shape"
						/>
						<feGaussianBlur stdDeviation="100" result="bgEffectBlur" />
					</filter>
					<filter
						id="bgFilter3"
						x="-960"
						y="-845.921"
						width="1932.12"
						height="1821.06"
						filterUnits="userSpaceOnUse"
						colorInterpolationFilters="sRGB"
					>
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feBlend
							mode="normal"
							in="SourceGraphic"
							in2="BackgroundImageFix"
							result="shape"
						/>
						<feGaussianBlur stdDeviation="150" result="bgEffectBlur" />
					</filter>
				</defs>
			</svg>
		</div>
	);
}
