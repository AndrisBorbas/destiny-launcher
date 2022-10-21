import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { forwardRef, memo, useEffect, useState } from "react";
import { FaAngleDown, FaGripVertical } from "react-icons/fa";
import { HiExternalLink } from "react-icons/hi";

import { currentCharacter, getPlatformCode } from "@/utils/bungieApi/utils";
import { useUser } from "@/utils/hooks";

import { TrackingLink } from "../link/TrackingLink";
import styles from "./Banner.module.scss";
import { H4 } from "./H4";

type BannerProps = {
	/* eslint-disable react/no-unused-prop-types */
	iconSrc: string;
	headerText: string;
	previewImage: string;
	previewBlurhash: string;
	url: string;
	loggedInURL?: string;
	category: string;
	id: string;
	isActive?: boolean;
	children: MDXRemoteSerializeResult;
	/* eslint-enable react/no-unused-prop-types */
} & Omit<React.HTMLProps<HTMLDivElement>, "children">;

export const Banner = memo(
	forwardRef<HTMLDivElement, BannerProps>(function Banner(
		/* eslint-disable react/prop-types */
		{
			iconSrc,
			headerText,
			previewImage,
			previewBlurhash,
			url,
			category,
			loggedInURL,
			id,
			isActive,
			className,
			children,
		},
		/* eslint-enable react/prop-types */
		ref,
	) {
		// Banners are hydrated with them being closed, less layout shift
		const [isOpened, setOpened] = useState(false);
		const {
			user,
			error: userError,
			isLoading,
			mutateUser,
		} = useUser("/", false);

		const link =
			user && loggedInURL
				? loggedInURL
						// eslint-disable-next-line react/prop-types
						.replace("{Profile}", user.profile.userInfo.membershipId)
						.replace("{Clan}", user.clan?.group.groupId ?? "")
						.replace(
							"{Platform}",
							user.profile.userInfo.membershipType.toString(),
						)
						.replace(
							"{Platform2Code}",
							getPlatformCode(user.profile.userInfo.membershipType, 0),
						)
						.replace(
							"{Character}",
							currentCharacter(user.characters)?.characterId ?? "",
						)
				: url;

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
					className,
				)}
				ref={setNodeRef}
				style={style}
				{...attributes}
			>
				<div className={styles.container}>
					<div className={styles.header}>
						<div className="flex w-14 items-center bg-banner-dark p-2 py-4">
							<TrackingLink
								className="relative block h-10 w-10"
								href={link}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={`${headerText} link`}
								isExternal
								eventName="banner-icon-click"
							>
								<Image
									src={iconSrc}
									objectFit="cover"
									layout="fill"
									alt={`${headerText} icon`}
									unoptimized
								/>
							</TrackingLink>
						</div>

						<h3 className={styles.headerText}>
							<TrackingLink
								href={link}
								target="_blank"
								rel="noopener noreferrer"
								isExternal
								eventName="banner-header-click"
							>
								<span className="mr-2">{headerText}</span>
								<span className="inline-block">
									<HiExternalLink className="h-6 w-6" />
								</span>
							</TrackingLink>
						</h3>

						<FaGripVertical
							className="cursor-move self-center text-2xl"
							{...listeners}
						/>

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
						// style={{ height: "292px" }}
						className={clsx(
							"aspect-w-16 aspect-h-9",
							isOpened ? "block" : "hidden",
							"relative",
						)}
					>
						<Image
							src={previewImage}
							objectFit="cover"
							layout="fill"
							// width={520}
							// height={292}
							sizes="520px"
							alt={`${headerText} preview`}
							placeholder="blur"
							blurDataURL={previewBlurhash}
						/>
					</div>

					<figure
						className={clsx(styles.figure, isOpened ? "block" : "hidden")}
					>
						<MDXRemote {...children} components={{ h4: H4 }} />
						<TrackingLink
							className={styles.button}
							href={link}
							target="_blank"
							rel="noopener noreferrer"
							isExternal
							eventName="banner-button-click"
						>
							Open
						</TrackingLink>
					</figure>
				</div>
			</article>
		);
	}),
);
