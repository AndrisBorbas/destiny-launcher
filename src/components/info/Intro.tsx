import styles from "./Intro.module.css";

export function Intro() {
	return (
		<section className={styles.intro} aria-labelledby="intro">
			<h2 id="intro" className={styles.headerText}>
				Every Destiny 2 tool, one launcher
			</h2>
			<p className={styles.text}>
				Destiny Launcher is a free, ad-free directory of the best community-made
				Destiny 2 tools and websites, all built on Bungie&apos;s public API.
				Instead of bookmarking a dozen sites, open item managers like Destiny
				Item Manager (DIM), databases like light.gg, activity trackers like Raid
				Report and the spreadsheets the community relies on, all from one page.
				Log in with Bungie.net to open supported sites straight to your own
				profile, and pin your favourites to the top. New to Destiny 2? Start
				with the Account Managers to sort your gear and loadouts, then explore
				the Informational sites for god rolls, lore and weekly rotations. None
				of these sites, including this one, are affiliated with Bungie.
			</p>
		</section>
	);
}
