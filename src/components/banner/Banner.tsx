import Image from "next/image";

import styles from "./Banner.module.scss";

type BannerProps = {
	iconSrc: string;
	headerText: string;
	previewImage: string;
	url: string;
} & React.HTMLProps<HTMLDivElement>;

export default function Banner({
	iconSrc,
	headerText,
	previewImage,
	url,
	children,
}: BannerProps) {
	return (
		<article className="flex flex-col bg-banner border-t-2 border-gray-300">
			<div className={styles.header}>
				<div className="flex items-center p-2 py-4 w-14 h-full bg-banner-dark">
					<a
						className="relative block w-10 h-10"
						href={url}
						target="_blank"
						rel="noopener"
					>
						<Image
							src={iconSrc}
							objectFit="cover"
							layout="fill"
							alt="Braytech icon"
						/>
					</a>
				</div>

				<h3 className={styles.headerText}>
					<a href={url} target="_blank" rel="noopener">
						{headerText}
					</a>
				</h3>
			</div>
			<a href={url} target="_blank" rel="noopener">
				<div className="aspect-w-16 aspect-h-9">
					<Image
						src={previewImage}
						objectFit="cover"
						layout="fill"
						alt="braytech banner"
					/>
				</div>
			</a>
			<figure className={styles.figure}>{children}</figure>
		</article>
	);
}
