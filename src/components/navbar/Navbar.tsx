import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect } from "react";
import { FaBars } from "react-icons/fa";

import navbarContent from "@/data/navbar.json";
import { useBool, useUser } from "@/utils/hooks";

import { TrackingLink } from "../link/TrackingLink";
import styles from "./Navbar.module.scss";
import { NavLink } from "./NavLink";

export default function Navbar() {
	const [isNavbarOpen, navbarHandlers] = useBool();
	const { user, error, isLoading, isValidating } = useUser("/", false);

	useEffect(() => {
		if (process.env.NODE_ENV !== "production") {
			// eslint-disable-next-line no-console
			console.log(user, error?.message, isLoading, isValidating);
		}
		return () => {};
	}, [user, error, isLoading, isValidating]);

	return (
		<header className={clsx(styles.header, "bg-blur-10")}>
			<Suspense>
				<div className="relative mx-auto flex w-full flex-wrap items-center justify-between px-2 lg:px-8">
					<div className="pointer-events-auto relative flex w-full items-center justify-between lg:static lg:block lg:w-auto lg:justify-start">
						<TrackingLink
							href="/#"
							replace
							className="mr-2 flex items-center text-2xl no-underline lg:text-4xl lg:leading-10"
							eventName="navbar-link-click"
						>
							<span className="relative mr-2 inline-block h-12 w-12">
								<Image src="/icon.png" alt="Logo" layout="fill" unoptimized />
							</span>
							<h1>Destiny Launcher</h1>
						</TrackingLink>
						<button
							className="block h-full cursor-pointer rounded border border-solid border-transparent bg-transparent py-2 px-2 text-xl leading-none outline-none focus:outline-none lg:hidden"
							type="button"
							onClick={navbarHandlers.toggle}
							aria-label="Navbar toggler"
						>
							<FaBars />
						</button>
					</div>
					<nav
						className={clsx(
							"pointer-events-auto z-50 w-full items-center lg:flex lg:w-auto",
							isNavbarOpen ? "flex" : "hidden",
						)}
					>
						<ul className="flex w-full list-none flex-col rounded-lg lg:ml-auto lg:w-auto lg:flex-row">
							{navbarContent.links.map(({ href, label }, i) => (
								<NavLink
									href={href}
									label={label}
									isFirst={i === 0}
									closeNavbar={navbarHandlers.setFalse}
									key={label}
									replace
								/>
							))}
							{!user && (
								<NavLink
									href="/api/auth/login"
									disabled={isLoading}
									label="Login"
									isLast
									closeNavbar={navbarHandlers.setFalse}
								/>
							)}
							{!!user && (
								<NavLink
									href="/api/auth/logout"
									label="Logout"
									isLast
									closeNavbar={navbarHandlers.setFalse}
								/>
							)}
						</ul>
					</nav>
				</div>
			</Suspense>
		</header>
	);
}
