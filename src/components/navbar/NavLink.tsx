import { cn } from "@/utils/utils";

import { TrackingLink } from "../link/TrackingLink";
import styles from "./NavLink.module.css";

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
	const eventName = () => {
		switch (label) {
			case "Login":
				return "login";
			case "Logout":
				return "logout";
			default:
				return "navbar-link-click";
		}
	};

	return (
		<li key={href} className="py-1 pl-2 lg:p-0">
			<TrackingLink
				href={href}
				passHref
				replace={replace}
				className={cn(
					disabled && "pointer-events-none cursor-not-allowed opacity-70",
				)}
				eventName={eventName()}
			>
				<button
					className={cn(
						styles.navlink,
						"hover:text-pink inline-block w-full px-2 py-2 text-xl font-medium lg:px-4 lg:text-xl xl:px-5 xl:text-2xl",
						isFirst && "lg:pl-0",
						isLast && "lg:pr-0",
					)}
					onClick={closeNavbar}
					onKeyUp={closeNavbar}
					type="button"
				>
					{label}
				</button>
			</TrackingLink>
		</li>
	);
}
