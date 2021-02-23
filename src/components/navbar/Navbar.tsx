import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { FaBars } from "react-icons/fa";

import navbarContent from "@/data/navbar.json";

import styles from "./Navbar.module.scss";

export default function Navbar() {
	const [navbarOpen, setNavbarOpen] = React.useState(false);
	return (
		<header className={clsx(styles.header, "bg-blur-10")}>
			<div className="relative flex flex-wrap items-center justify-between mx-auto px-4 w-full sm:px-8">
				<div className="relative flex justify-between w-full sm:static sm:block sm:justify-start sm:w-auto">
					<Link href="/#">
						<a className="block mr-8 no-underline text-2xl lg:text-4xl lg:leading-10">
							Destiny Launcher
						</a>
					</Link>
					<button
						className="bg-transparent border-transparent block px-3 py-2 text-xl leading-none border border-solid rounded outline-none focus:outline-none cursor-pointer sm:hidden"
						type="button"
						onClick={() => setNavbarOpen(!navbarOpen)}
						aria-label="Navbar toggler"
					>
						<FaBars />
					</button>
				</div>
				<nav
					className={clsx(
						"z-50 items-center sm:flex",
						navbarOpen ? "flex" : " hidden",
					)}
				>
					<ul className="flex flex-col rounded-lg list-none lowercase sm:flex-row sm:ml-auto sm:w-auto">
						{navbarContent.links.map(({ href, label }, i) => (
							<li key={`${href}`} className="pl-2 py-1 w-full sm:pl-0">
								<Link href={href}>
									<a
										className={clsx(
											"hover:text-pink inline-block px-2 py-2 w-full text-xl font-medium sm:px-5 sm:text-2xl",
											i === 0 && "sm:pl-2",
											i === navbarContent.links.length - 1 && "sm:pr-2",
										)}
									>
										{label}
									</a>
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</header>
	);
}
