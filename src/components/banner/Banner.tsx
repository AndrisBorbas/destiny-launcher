import Image from "next/image";

import styles from "./Banner.module.scss";

export default function Banner() {
	return (
		<article className="flex flex-col border-t-2 border-white">
			<div className={styles.header}>
				<div className="flex items-center p-2 py-4 w-14 h-full bg-banner-dark">
					<div className="relative w-10 h-10">
						<Image
							src="/assets/images/braytech-icon.png"
							objectFit="cover"
							layout="fill"
							alt="Braytech icon"
						/>
					</div>
				</div>
				<h3 className={styles.headerText}>Ishtar-Collective</h3>
			</div>
			<div className="aspect-w-16 aspect-h-9">
				<Image
					src="/assets/images/braytech.jpg"
					objectFit="cover"
					layout="fill"
					alt="braytech banner"
				/>
			</div>
		</article>
	);
}
