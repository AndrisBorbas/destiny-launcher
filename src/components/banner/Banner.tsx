import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import React, { useEffect, useState } from "react";
import { FaAngleDown } from "react-icons/fa";

import { currentCharacter } from "@/utils/bungieApi/utils";
import { useUser } from "@/utils/hooks";

import styles from "./Banner.module.scss";
import H4 from "./H4";

type BannerProps = {
	iconSrc: string;
	headerText: string;
	previewImage: string;
	url: string;
	loggedInURL?: string;
	category: string;
	id: string;
	isActive?: boolean;
	children: MDXRemoteSerializeResult;
} & React.HTMLProps<HTMLDivElement>;

const Banner = React.memo(
	React.forwardRef<HTMLDivElement, BannerProps>(
		(
			/* eslint-disable react/prop-types */
			{
				iconSrc,
				headerText,
				previewImage,
				url,
				category,
				loggedInURL,
				id,
				isActive,
				children,
			},
			/* eslint-enable react/prop-types */
			ref,
		) => {
			// Banners are hydrated with them being closed, less layout shift
			const [isOpened, setOpened] = useState(false);
			const {
				user,
				error: userError,
				isLoading,
				mutateUser,
			} = useUser("/", false);

			function getLink() {
				return user && loggedInURL
					? loggedInURL
							.replace("{Profile}", user.profile.userInfo.membershipId)
							.replace(
								"{Character}",
								currentCharacter(user.characters)?.characterId ?? "",
							)
					: url;
			}

			useEffect(() => {
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

			const { attributes, listeners, setNodeRef, transform, transition } =
				useSortable({ id });

			const style = {
				transform: CSS.Translate.toString(transform),
				transition,
			};
			return (
				<article
					className={clsx(
						styles.banner,
						isOpened ? "row-span-6" : "row-span-1",
						isActive === true ? "opacity-0" : "opacity-100",
					)}
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
									href={getLink()}
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
								<a href={getLink()} target="_blank" rel="noopener">
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
							<Image
								src={previewImage}
								objectFit="cover"
								layout="fill"
								alt={`${headerText} preview`}
							/>
						</div>

						<figure
							className={clsx(styles.figure, isOpened ? "block" : "hidden")}
						>
							<MDXRemote {...children} components={{ h4: H4 }} />
							<a
								className={styles.button}
								href={getLink()}
								target="_blank"
								rel="noopener"
							>
								Open
							</a>
						</figure>
					</div>
				</article>
			);
		},
	),
);

Banner.displayName = "Banner";

export default Banner;
