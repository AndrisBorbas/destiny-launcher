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
			<div className="flex relative flex-wrap justify-between items-center px-2 lg:px-8 mx-auto w-full">
				<div className="flex lg:block relative lg:static justify-between lg:justify-start items-center w-full lg:w-auto pointer-events-auto">
					<Link href="/#" replace>
						<a className="flex items-center mr-2 text-2xl lg:text-4xl lg:leading-10 no-underline">
							<span className="inline-block relative mr-2 w-12 h-12">
								<Image src="/icon.png" alt="Logo" layout="fill" unoptimized />
							</span>
							<h1>Destiny Launcher</h1>
						</a>
					</Link>
					<button
						className="block lg:hidden py-2 px-2 h-full text-xl leading-none rounded border border-solid cursor-pointer outline-none focus:outline-none bg-transparent border-transparent"
						type="button"
						onClick={navbarHandlers.toggle}
						aria-label="Navbar toggler"
					>
						<FaBars />
					</button>
				</div>
				<nav
					className={clsx(
						"lg:flex z-50 items-center w-full lg:w-auto pointer-events-auto",
						isNavbarOpen ? "flex" : "hidden",
					)}
				>
					<ul className="flex flex-col lg:flex-row lg:ml-auto w-full lg:w-auto list-none rounded-lg">
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
