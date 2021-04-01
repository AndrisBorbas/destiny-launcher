import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { FaAngleDown } from "react-icons/fa";

import styles from "./Banner.module.scss";

type BannerProps = {
	iconSrc: string;
	headerText: string;
	previewImage: string;
	url: string;
	category: string;
	id: string;
} & React.HTMLProps<HTMLDivElement>;

export const BannerPreview = React.forwardRef<HTMLDivElement, BannerProps>(
	// eslint-disable-next-line react/prop-types
	({ children, ...props }, ref) => {
		return (
			<article {...props} ref={ref}>
				{children}
			</article>
		);
	},
);

export default function Banner({
	iconSrc,
	headerText,
	previewImage,
	url,
	category,
	id,
	children,
}: BannerProps) {
	// Banners are hydrated with them being closed, less layout shift
	const [isOpened, setOpened] = React.useState(false);

	React.useEffect(() => {
		const jsonString = localStorage.getItem("toggledBanners");
		const map =
			jsonString != null
				? new Map<string, boolean>(JSON.parse(jsonString))
				: new Map<string, boolean>();
		// But when the page loads they are opened if there is no stored value
		setOpened(map.get(url) ?? true);
		return () => {};
	}, [url]);

	function saveState(state: boolean) {
		const jsonString = localStorage.getItem("toggledBanners");
		const map =
			jsonString != null
				? new Map<string, boolean>(JSON.parse(jsonString))
				: new Map<string, boolean>();
		map.set(url, state);
		localStorage.setItem(
			"toggledBanners",
			JSON.stringify(Array.from(map.entries())),
		);
	}

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<BannerPreview
			className={clsx(styles.banner, isOpened ? "row-span-6" : "row-span-1")}
			ref={setNodeRef}
			// @ts-expect-error: No idea
			style={style}
			{...attributes}
			{...listeners}
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
						className={styles.toggle}
						animate={{
							rotate: isOpened ? 180 : 0,
						}}
						transition={{
							duration: 0.3,
							ease: "backInOut",
						}}
					>
						<button
							type="button"
							onClick={() => {
								saveState(!isOpened);
								setOpened(!isOpened);
							}}
							aria-label="Toggle open button"
						>
							<FaAngleDown className="text-5xl" />
						</button>
					</motion.div>
				</div>

				<div
					className={clsx(
						"aspect-w-16 aspect-h-9",
						isOpened ? "block" : "hidden",
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

				<figure className={clsx(styles.figure, isOpened ? "block" : "hidden")}>
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
		</BannerPreview>
	);
}
