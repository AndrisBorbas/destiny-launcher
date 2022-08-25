import clsx from "clsx";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { SiKofi } from "react-icons/si";

import manifest from "@/../package.json";

import { TrackingLink } from "../link/TrackingLink";
import styles from "./Footer.module.scss";

type FooterProps = {
	buildDate?: number;
};

export default function Footer({ buildDate }: FooterProps) {
	const buildDateFormat = buildDate && new Date(buildDate);
	const buildDateString = buildDate
		? new Intl.DateTimeFormat("hu-HU", {
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
		  })
				.format(buildDateFormat)
				.match(/\d+/g)
				?.join("")
		: "";
	return (
		<footer className={clsx(styles.footer, "bg-blur-10")} id="footer">
			<div className="container mx-auto flex flex-col items-center justify-center space-y-6">
				<div className="flex w-full items-center justify-evenly lg:w-1/3">
					<TrackingLink
						href="https://twitter.com/AndrisBorbas"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Twitter link"
						isExternal
						eventName="footer-link-click"
					>
						<FaTwitter className="h-auto w-10 text-white hover:text-yellow-500" />
					</TrackingLink>
					<TrackingLink
						href="https://www.github.com/andrisborbas/destiny-launcher"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="GitHub link"
						isExternal
						eventName="footer-link-click"
					>
						<FaGithub className="h-auto w-10 text-white hover:text-yellow-500" />
					</TrackingLink>
					<TrackingLink
						href="https://ko-fi.com/andrisborbas"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Ko-fi link"
						isExternal
						eventName="footer-link-click"
					>
						<SiKofi className="h-auto w-10 text-white hover:text-yellow-500" />
					</TrackingLink>
				</div>

				<div className="flex w-full flex-row justify-between">
					<p className="pr-4 text-xs">
						Destiny is a registered trademark of Bungie. Some content and images
						are the property of Bungie.
					</p>
					<p className="text-xs decoration-yellow-300 underline-offset-2 hover:underline">
						<TrackingLink
							href="https://www.github.com/andrisborbas/destiny-launcher"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="GitHub link"
							isExternal
							eventName="footer-link-click"
						>
							v{manifest.version}.{buildDateString} ©&nbsp;
							{new Date().getFullYear()}
							&nbsp;AndrisBorbas
						</TrackingLink>
					</p>
				</div>
			</div>
		</footer>
	);
}
