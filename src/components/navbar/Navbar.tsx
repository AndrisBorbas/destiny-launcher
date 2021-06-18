import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { FaBars } from "react-icons/fa";

import navbarContent from "@/data/navbar.json";
import { useBool, useUser } from "@/utils/hooks";

import styles from "./Navbar.module.scss";
import { NavLink } from "./NavLink";

export default function Navbar() {
	const [isNavbarOpen, navbarHandlers] = useBool();
	const { user, error, isLoading, mutateUser } = useUser("/", false);

	useEffect(() => {
		if (process.env.NODE_ENV !== "production")
			console.log(user, error, isLoading);

		return () => {};
	}, [user, error, isLoading]);

	return (
		<header className={clsx(styles.header, "bg-blur-10")}>
			<div className="relative flex flex-wrap items-center justify-between mx-auto px-2 w-full lg:px-8">
				<div className="relative flex items-center justify-between w-full pointer-events-auto lg:static lg:block lg:justify-start lg:w-auto">
					<Link href="/#" replace>
						<a className="flex items-center mr-2 no-underline text-2xl lg:text-4xl lg:leading-10">
							<span className="relative inline-block mr-2 w-12 h-12">
								<Image src="/icon.png" alt="Logo" layout="fill" />
							</span>
							<h1>Destiny Launcher</h1>
						</a>
					</Link>
					<button
						className="bg-transparent border-transparent block px-2 py-2 h-full text-xl leading-none border border-solid rounded outline-none focus:outline-none cursor-pointer lg:hidden"
						type="button"
						onClick={navbarHandlers.toggle}
						aria-label="Navbar toggler"
					>
						<FaBars />
					</button>
				</div>
				<nav
					className={clsx(
						"z-50 items-center w-full pointer-events-auto lg:flex lg:w-auto",
						isNavbarOpen ? "flex" : "hidden",
					)}
				>
					<ul className="flex flex-col w-full rounded-lg list-none lg:flex-row lg:ml-auto lg:w-auto">
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
						{(!!error || isLoading) && (
							<NavLink
								href="/api/auth/login"
								label="Login"
								isLast
								closeNavbar={navbarHandlers.setFalse}
							/>
						)}
						{!error && !isLoading && (
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
		</header>
	);
}
