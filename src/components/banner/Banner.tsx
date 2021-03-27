import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { useDrag } from "react-dnd";
import { FaAngleDown } from "react-icons/fa";

import styles from "./Banner.module.scss";

type BannerProps = {
	iconSrc: string;
	headerText: string;
	previewImage: string;
	url: string;
} & React.HTMLProps<HTMLDivElement>;

export const BannerDragType = "banner";

export default function Banner({
	iconSrc,
	headerText,
	previewImage,
	url,
	children,
	forceClosed,
}: BannerProps & { forceClosed?: boolean }) {
	// Banners are hydrated with them being closed, less layout shift
	const [isOpened, setOpened] = React.useState(false);

	React.useEffect(() => {
		const value = localStorage.getItem(url);
		// But when the page loads they are opened if there is no stored value
		setOpened(value !== null ? JSON.parse(value) : true);
		return () => {};
	}, [url]);

	React.useEffect(() => {
		localStorage.setItem(url, JSON.stringify(isOpened));
		return () => {};
	}, [url, isOpened]);

	const [{ isDragging }, drag] = useDrag(() => ({
		type: BannerDragType,
		item: { url },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	return (
		<article
			className={clsx(
				styles.banner,
				forceClosed === true || !isOpened ? "row-span-1" : "row-span-6",
				isDragging ? "opacity-50" : "opacity-100",
			)}
			ref={drag}
		>
			<div className={styles.container}>
				<div className={styles.header}>
					<div className="flex items-center p-2 py-4 w-14 bg-banner-dark">
						<a
							className="relative block w-10 h-10"
							href={url}
							target="_blank"
							rel="noopener"
							aria-label={`${headerText} link`}
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

					<motion.div
						className={clsx(styles.toggle)}
						animate={{
							rotate: forceClosed === true || !isOpened ? 0 : 180,
						}}
						transition={{
							duration: 0.3,
							ease: "backInOut",
						}}
					>
						<button
							type="button"
							onClick={() => {
								setOpened(!isOpened);
							}}
							aria-label="Toggle open button"
							disabled={forceClosed === true}
						>
							<FaAngleDown
								className={clsx(
									"text-5xl",
									forceClosed === true
										? "cursor-not-allowed"
										: "cursor-pointer",
								)}
							/>
						</button>
					</motion.div>
				</div>

				<div
					className={clsx(
						"aspect-w-16 aspect-h-9",
						forceClosed === true || !isOpened ? "hidden" : "block",
					)}
				>
					<a
						href={url}
						target="_blank"
						rel="noopener"
						aria-label={`${headerText} link`}
					>
						<Image
							src={previewImage}
							objectFit="cover"
							layout="fill"
							alt={`${headerText} preview`}
						/>
					</a>
				</div>

				<figure
					className={clsx(
						styles.figure,
						forceClosed === true || !isOpened ? "hidden" : "block",
					)}
				>
					{children}
					<a
						className={styles.button}
						href={url}
						target="_blank"
						rel="noopener"
					>
						Open
					</a>
				</figure>
			</div>
		</article>
	);
}
