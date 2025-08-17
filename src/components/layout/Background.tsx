import clsx from "clsx";
import type { MotionValue } from "framer-motion";
import { motion, useSpring } from "framer-motion";
import type { RefObject } from "react";

import { cn } from "@/utils/utils";

import styles from "./Background.module.css";

export type BackgroundProps = {
	enabled: boolean;
};

// Original from https://twitter.com/laudis_io/status/1569750442703466496

export function Background({ enabled }: BackgroundProps) {
	return (
		<div className={styles.background}>
			<div className={styles.bg} />
			{/* <svg
				preserveAspectRatio="xMidYMid slice"
				style={{ display: enabled ? "initial" : "none" }}
				width="1920"
				height="1080"
				viewBox="0 0 1920 1080"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect width="1920" height="1080" fill="#080B17" />
				<g filter="url(#filter0_f_1_20)">
					<path
						d="M1523 -95.9997C1519.33 38.3336 1607.4 308.801 1989 316.001L2012 919.001C1761.5 916.001 1452 1026.5 1318.5 1119C1767 1963.5 389.5 1990.5 772.5 1119C591 1006.17 159.4 780.201 -115 779.001V194.501C-3.33334 201.167 220 152.4 220 -95.9997C-27.5 -743.5 1794 -718 1523 -95.9997Z"
						fill="#100726"
					/>
				</g>
				<g filter="url(#filter1_f_1_20)">
					<path
						d="M491 214.5C470 144.333 440.6 -8.60001 491 -59C877 -69.3333 1653.3 -81.7 1670.5 -48.5C1692 -7.00001 1692 136 1684.5 214.5C1677 293 1601.5 496 1570.5 531.5C1539.5 567 1421.5 811.5 1410.5 868.5C1399.5 925.5 1324.5 1091.5 1298.5 1119C1277.7 1141 1265.17 1145.5 1261.5 1145L600 1136C591.333 1141.67 572.1 1138.5 564.5 1080.5C555 1008 552.5 851.5 564.5 788.5C576.5 725.5 583 567 574 479C566.8 408.6 515.667 273.333 491 214.5Z"
						fill="#1B1337"
					/>
				</g>
				<g style={{ mixBlendMode: "screen" }} filter="url(#filter2_f_1_20)">
					<path
						d="M-31.0848 338.677C-130.379 370.677 -393.768 496.613 -561 637L-486.791 -291L919 -259C893.915 -223.903 616.938 4.2258 510.328 78.5484C403.718 152.871 68.209 306.677 -31.0848 338.677Z"
						fill="#591345"
					/>
				</g>
				<g filter="url(#filter3_f_1_20)">
					<path
						d="M793 -223.5C789.167 -215.667 709.9 -27.9 701.5 22.5C691 85.5 689.5 152.5 723.5 200C757.5 247.5 814 268 849.5 344.5C885 421 961.5 549 985.5 630.5C1009.5 712 1073.5 838 1079 909.5C1084.5 981 1051 1320 1042.5 1369.5"
						stroke="#371053"
						strokeWidth="103"
						strokeLinecap="round"
					/>
				</g>
				<g filter="url(#filter4_f_1_20)">
					<path
						d="M908.423 -31.9176C950.837 -63.084 1005.59 -132.75 1027.95 -140.083L1567 -152C1504.54 -70.4173 1369.27 100.081 1327.94 129.414C1276.27 166.081 1175.25 198.164 1058.8 227.497C942.355 256.83 916.135 217.414 889.144 198.164C862.153 178.914 796.604 119.331 809.714 66.165C822.824 12.9987 866.009 -0.75116 908.423 -31.9176Z"
						fill="#810D5F"
					/>
				</g>
				<g filter="url(#filter5_f_1_20)">
					<path
						d="M1125.2 1124.5C1178.2 1099.5 1156.7 1010 1054.2 997.501C1018.7 1013 1020.7 1086 1015.7 1124.5C1010.7 1163 1072.2 1149.5 1125.2 1124.5Z"
						fill="#0E1428"
					/>
					<path
						d="M483.696 433.811C480.196 465.811 512.195 498.813 565.195 532.313C586.126 546.313 669.195 620.812 686.695 617.312C704.195 613.812 700.695 599.812 695.696 587.312C690.696 574.812 669.195 546.813 640.695 532.313C612.195 517.813 600.195 479.811 600.195 461.811C600.195 443.811 610.695 419.811 600.195 394.811C589.695 369.811 554.696 361.312 524.696 371.812C494.696 382.312 487.196 401.811 483.696 433.811Z"
						fill="#0E1428"
					/>
					<path
						d="M1070.7 295.311C1090.7 340.811 1150.2 361.811 1190.7 383.811C1210.7 394.072 1222.2 400.811 1220.7 419.311C1219.2 437.811 1202.2 433.811 1170.7 433.811C1139.2 433.811 1080.2 383.812 1059.7 371.311C1039.2 358.811 1048.7 347.311 1015.7 383.811C982.696 420.311 851.196 415.311 808.696 400.811C766.196 386.311 766.194 358.312 771.694 328.812C777.194 299.312 814.196 332.312 823.696 347.312C833.196 362.312 873.196 372.811 921.196 371.311C969.196 369.811 975.196 315.811 995.196 306.311C1015.2 296.811 991.696 265.812 975.196 236.312C958.696 206.812 960.196 151.311 975.196 122.811C990.196 94.3115 1026.7 122.811 1015.7 151.311C1004.7 179.811 1050.7 249.811 1070.7 295.311Z"
						fill="#0E1428"
					/>
					<path
						d="M1299.2 737.506C1246.7 737.506 1242.7 688.506 1266.7 662.006C1275.91 648.006 1257.2 628.506 1238.2 644.006C1219.2 659.506 1220.7 653.506 1199.2 688.506C1177.7 723.506 1180.2 750.506 1220.7 776.506C1261.2 802.506 1304.2 770.006 1323.7 765.006C1343.2 760.006 1351.7 737.506 1299.2 737.506Z"
						fill="#0E1428"
					/>
				</g>
				<g filter="url(#filter6_f_1_20)">
					<path
						d="M247 686C194 711 215.5 800.5 318 813C353.5 797.5 351.5 724.5 356.5 686C361.5 647.5 300 661 247 686Z"
						fill="#25122A"
					/>
					<path
						d="M1620 208C1602.5 213.5 1593.5 266 1637.5 296C1664.12 327.5 1671 349 1708 356C1745 363 1763 333 1777 308.5C1791 284 1734.5 282 1708 273.5C1681.5 265 1690.5 227.5 1681.5 208C1672.5 188.5 1637.5 202.5 1620 208Z"
						fill="#25122A"
					/>
					<path
						d="M1434.5 666.5C1438 634.5 1406 601.499 1353 567.999C1332.07 553.999 1249 479.499 1231.5 482.999C1214 486.499 1217.5 500.499 1222.5 512.999C1227.5 525.499 1249 553.499 1277.5 567.999C1306 582.499 1318 620.5 1318 638.5C1318 656.5 1307.5 680.5 1318 705.5C1328.5 730.5 1363.5 739 1393.5 728.5C1423.5 718 1431 698.5 1434.5 666.5Z"
						fill="#25122A"
					/>
					<path
						d="M847.5 805C827.5 759.5 768 738.5 727.5 716.5C707.5 706.239 696 699.5 697.5 681C699 662.5 716 666.5 747.5 666.5C779 666.5 838 716.5 858.5 729C879 741.5 869.5 753 902.5 716.5C935.5 680 1067 685 1109.5 699.5C1152 714 1152 742 1146.5 771.5C1141 801 1104 768 1094.5 753C1085 738 1045 727.5 997 729C949 730.5 943 784.5 923 794C903 803.5 926.5 834.5 943 864C959.5 893.5 958 949 943 977.5C928 1006 891.5 977.5 902.5 949C913.5 920.5 867.5 850.5 847.5 805Z"
						fill="#25122A"
					/>
					<path
						d="M1177.5 224.5C1230 224.5 1234 273.5 1210 300C1200.79 314 1219.5 333.5 1238.5 318C1257.5 302.5 1256 308.5 1277.5 273.5C1299 238.5 1296.5 211.5 1256 185.5C1215.5 159.5 1172.5 192 1153 197C1133.5 202 1125 224.5 1177.5 224.5Z"
						fill="#25122A"
					/>
				</g>
				<defs>
					<filter
						id="filter0_f_1_20"
						x="-515"
						y="-972.11"
						width="2927"
						height="3134.65"
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
						<feGaussianBlur
							stdDeviation="200"
							result="effect1_foregroundBlur_1_20"
						/>
					</filter>
					<filter
						id="filter1_f_1_20"
						x="163.172"
						y="-370.082"
						width="1825.86"
						height="1815.12"
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
						<feGaussianBlur
							stdDeviation="150"
							result="effect1_foregroundBlur_1_20"
						/>
					</filter>
					<filter
						id="filter2_f_1_20"
						x="-961"
						y="-691"
						width="2280"
						height="1728"
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
						<feGaussianBlur
							stdDeviation="200"
							result="effect1_foregroundBlur_1_20"
						/>
					</filter>
					<filter
						id="filter3_f_1_20"
						x="343.37"
						y="-575.012"
						width="1087.73"
						height="2296.02"
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
						<feGaussianBlur
							stdDeviation="150"
							result="effect1_foregroundBlur_1_20"
						/>
					</filter>
					<filter
						id="filter4_f_1_20"
						x="608"
						y="-352"
						width="1159"
						height="790"
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
						<feGaussianBlur
							stdDeviation="100"
							result="effect1_foregroundBlur_1_20"
						/>
					</filter>
					<filter
						id="filter5_f_1_20"
						x="283.435"
						y="-88.9936"
						width="1255.35"
						height="1437.57"
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
						<feGaussianBlur
							stdDeviation="100"
							result="effect1_foregroundBlur_1_20"
						/>
					</filter>
					<filter
						id="filter6_f_1_20"
						x="69.0074"
						y="25.5313"
						width="1860.19"
						height="1113.77"
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
						<feGaussianBlur
							stdDeviation="75"
							result="effect1_foregroundBlur_1_20"
						/>
					</filter>
				</defs>
			</svg> */}
			<div
				className={cn(styles.image)}
				style={{ display: enabled ? "initial" : "none" }}
			/>
		</div>
	);
}
