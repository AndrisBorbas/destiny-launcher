import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";

import styles from "./NavLink.module.scss";

export type NavLinkProps = {
	href: string;
	isFirst?: boolean;
	isLast?: boolean;
	closeNavbar: () => void;
	label: string;
	replace?: boolean;
};

export function NavLink({
	href,
	isFirst,
	isLast,
	label,
	closeNavbar,
	replace,
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
		<li key={`${href}`} className="pl-2 py-1 lg:p-0">
			<Link href={href} passHref replace={replace}>
				<motion.a
					className={clsx(
						styles.navlink,
						"hover:text-pink inline-block px-2 py-2 w-full text-xl font-medium lg:px-5 lg:text-2xl",
						isFirst && "lg:pl-2",
						isLast && "lg:pr-2",
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
				</motion.a>
			</Link>
		</li>
	);
}
