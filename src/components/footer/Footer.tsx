import clsx from "clsx";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { SiKoFi } from "react-icons/si";

import styles from "./Footer.module.scss";

export default function Footer() {
	return (
		<footer className={clsx(styles.footer, "bg-blur-10")} id="footer">
			<div className="container flex flex-col items-center justify-center mx-auto space-y-6">
				<div className="flex items-center justify-evenly w-full lg:w-1/3">
					<a
						href="https://twitter.com/AndrisBorbas"
						target="_blank"
						rel="noopener"
						aria-label="Twitter link"
					>
						<FaTwitter className="w-10 h-auto text-white hover:text-yellow-500" />
					</a>
					<a
						href="https://www.github.com/andrisborbas/destiny-launcher"
						target="_blank"
						rel="noopener"
						aria-label="GitHub link"
					>
						<FaGithub className="w-10 h-auto text-white hover:text-yellow-500" />
					</a>
					<a
						href="https://ko-fi.com/andrisborbas"
						target="_blank"
						rel="noopener"
						aria-label="Ko-fi link"
					>
						<SiKoFi className="w-10 h-auto text-white hover:text-yellow-500" />
					</a>
				</div>

				<div className="flex flex-row justify-between w-full">
					<p className="pr-4 text-xs">
						Destiny is a registered trademark of Bungie. Some content and images
						are the property of Bungie.
					</p>
					<a className="text-xs" href="https://twitter.com/AndrisBorbas">
						© 2021 AndrisBorbas
					</a>
				</div>
			</div>
		</footer>
	);
}
