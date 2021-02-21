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
		<article className={styles.banner}>
			<div className={styles.container}>
				<div className={styles.header}>
					<div className="flex items-center p-2 py-4 w-14 bg-banner-dark">
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
								alt={`${headerText} icon`}
							/>
						</a>
					</div>

					<h3 className={styles.headerText}>
						<a href={url} target="_blank" rel="noopener">
							{headerText}
						</a>
					</h3>
				</div>

				<div className="aspect-w-16 aspect-h-9">
					<a href={url} target="_blank" rel="noopener">
						<Image
							src={previewImage}
							objectFit="cover"
							layout="fill"
							alt={`${headerText} preview`}
						/>
					</a>
				</div>

				<figure className={styles.figure}>{children}</figure>
			</div>
		</article>
	);
}
