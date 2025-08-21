import { TrackingLink } from "@/components/link/TrackingLink";
import { Notice } from "@/components/notice/Notice";

import styles from "./Notices.module.css";

export function Notices() {
	return (
		<section className={styles.notices}>
			<Notice id="notice11" className="">
				<h2 className="">Update Live:</h2>
				<p className="text-base">
					Login to view the dashboard page with your characters, inventory and
					quick links to popular sites. Pin sites from the home page to the
					dashboard for quick access.
				</p>

				<p className="mt-2 text-sm">
					Please{" "}
					<TrackingLink
						href="https://ko-fi.com/andrisborbas"
						className="underline decoration-yellow-300 hover:underline-offset-2"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Ko-fi link"
						isExternal
						eventName="notice-link-click"
					>
						consider supporting
					</TrackingLink>{" "}
					if you like this project, so the site can keep running ad-free.
				</p>
			</Notice>
		</section>
	);
}
