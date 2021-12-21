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
		<li key={`${href}`} className="lg:p-0 py-1 pl-2">
			<Link href={href} passHref replace={replace}>
				<motion.a
					className={clsx(
						styles.navlink,
						"inline-block py-2 px-2 lg:px-4 xl:px-5 w-full text-xl lg:text-xl xl:text-2xl font-medium hover:text-pink",
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
				</motion.a>
			</Link>
		</li>
	);
}
