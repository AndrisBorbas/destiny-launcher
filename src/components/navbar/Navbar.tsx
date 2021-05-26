import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaBars } from "react-icons/fa";

import navbarContent from "@/data/navbar.json";

import styles from "./Navbar.module.scss";

export default function Navbar() {
	const [navbarOpen, setNavbarOpen] = React.useState(false);

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
						onClick={() => setNavbarOpen(!navbarOpen)}
						aria-label="Navbar toggler"
					>
						<FaBars />
					</button>
				</div>
				<nav
					className={clsx(
						"z-50 items-center w-full pointer-events-auto lg:flex lg:w-auto",
						navbarOpen ? "flex" : "hidden",
					)}
				>
					<ul className="flex flex-col w-full rounded-lg list-none lg:flex-row lg:ml-auto lg:w-auto">
						{navbarContent.links.map(({ href, label }, i) => (
							<li key={`${href}`} className="pl-2 py-1 lg:p-0">
								<Link href={href} passHref replace>
									<motion.a
										className={clsx(
											styles.navlink,
											"hover:text-pink inline-block px-2 py-2 w-full text-xl font-medium lg:px-5 lg:text-2xl",
											i === 0 && "lg:pl-2",
											i === navbarContent.links.length - 1 && "lg:pr-2",
										)}
										onClick={() => setNavbarOpen(false)}
										onKeyPress={() => setNavbarOpen(false)}
										role="link"
										tabIndex={i}
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
						))}
					</ul>
				</nav>
			</div>
		</header>
	);
}
