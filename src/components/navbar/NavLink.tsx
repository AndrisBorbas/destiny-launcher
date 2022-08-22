import clsx from "clsx";
import { motion } from "framer-motion";

import { TrackingLink } from "../link/TrackingLink";
import styles from "./NavLink.module.scss";

export type NavLinkProps = {
	href: string;
	isFirst?: boolean;
	isLast?: boolean;
	closeNavbar: () => void;
	label: string;
	replace?: boolean;
	disabled?: boolean;
};

export function NavLink({
	href,
	isFirst,
	isLast,
	label,
	closeNavbar,
	replace,
	disabled,
}: NavLinkProps) {
	const variants = {
		initial: {
			"--after-w": "0%",
			rotation: 0.001,
		},
		hover: {
			"--after-w": "100%",
			rotation: 0.001,
		},
	};
	return (
		<li key={`${href}`} className="py-1 pl-2 lg:p-0">
			<TrackingLink
				href={href}
				passHref
				replace={replace}
				className={clsx(
					disabled && "pointer-events-none cursor-default opacity-70",
				)}
				eventName="navbar-link-click"
			>
				<motion.p
					className={clsx(
						styles.navlink,
						"hover:text-pink inline-block w-full py-2 px-2 text-xl font-medium lg:px-4 lg:text-xl xl:px-5 xl:text-2xl",
						isFirst && "lg:pl-0",
						isLast && "lg:pr-0",
					)}
					onClick={closeNavbar}
					onKeyPress={closeNavbar}
					role="link"
					// @ts-expect-error: Variants work, I don't know why it is an error
					variants={variants}
					initial="initial"
					whileHover="hover"
					whileFocus="hover"
					transition={{ duration: 0.3 }}
				>
					{label}
				</motion.p>
			</TrackingLink>
		</li>
	);
}
