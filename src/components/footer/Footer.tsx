import clsx from "clsx";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { SiKofi } from "react-icons/si";

import manifest from "@/../package.json";

import styles from "./Footer.module.scss";

export default function Footer() {
	return (
		<footer className={clsx(styles.footer, "bg-blur-10")} id="footer">
			<div className="container mx-auto flex flex-col items-center justify-center space-y-6">
				<div className="flex w-full items-center justify-evenly lg:w-1/3">
					<a
						href="https://twitter.com/AndrisBorbas"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Twitter link"
					>
						<FaTwitter className="h-auto w-10 text-white hover:text-yellow-500" />
					</a>
					<a
						href="https://www.github.com/andrisborbas/destiny-launcher"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="GitHub link"
					>
						<FaGithub className="h-auto w-10 text-white hover:text-yellow-500" />
					</a>
					<a
						href="https://ko-fi.com/andrisborbas"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Ko-fi link"
					>
						<SiKofi className="h-auto w-10 text-white hover:text-yellow-500" />
					</a>
				</div>

				<div className="flex w-full flex-row justify-between">
					<p className="pr-4 text-xs">
						Destiny is a registered trademark of Bungie. Some content and images
						are the property of Bungie.
					</p>
					<p className="text-xs">
						<a
							href="https://www.github.com/andrisborbas/destiny-launcher"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="GitHub link"
						>
							v{manifest.version} ©&nbsp;{new Date().getFullYear()}
							&nbsp;AndrisBorbas
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
