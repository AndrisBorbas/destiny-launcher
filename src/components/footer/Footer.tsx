import clsx from "clsx";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { SiKofi } from "react-icons/si";

import manifest from "@/../package.json";

import { TrackingLink } from "../link/TrackingLink";
import styles from "./Footer.module.scss";

type FooterProps = {
	buildDate?: number;
	animate: boolean;
	setAnimate: (animate: boolean) => void;
};

export function Footer({ buildDate, animate, setAnimate }: FooterProps) {
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

				<div className="flex flex-col items-center justify-center">
					<label
						htmlFor="animateToggle"
						className="relative inline-flex cursor-pointer items-center"
					>
						<input
							type="checkbox"
							value=""
							id="animateToggle"
							name="animateToggle"
							className="peer sr-only"
							checked={animate}
							onChange={(e) => setAnimate(e.target.checked)}
						/>
						<div className="peer h-6 w-11 rounded-full bg-button bg-opacity-10 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-600 after:bg-white after:transition-all after:content-[''] peer-checked:bg-button peer-checked:bg-opacity-60 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-button" />
						<span className="ml-3 text-sm font-medium">
							Background animations
						</span>
					</label>
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
