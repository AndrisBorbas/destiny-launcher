import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import Image from "next/image";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { memo, useEffect, useState } from "react";
import { FaAngleDown, FaGripVertical, FaRegStar, FaStar } from "react-icons/fa";
import { HiExternalLink } from "react-icons/hi";

import { currentCharacter, getPlatformCode } from "@/utils/bungieApi/utils";
import { useFavourites, useUser } from "@/utils/hooks";
import { cn } from "@/utils/utils";

import { TrackingLink } from "../link/TrackingLink";
import styles from "./Banner.module.css";
import { H4 } from "./H4";

type BannerProps = {
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
} & Omit<React.HTMLProps<HTMLDivElement>, "children">;

export const Banner = memo(function Banner({
	iconSrc,
	headerText,
	previewImage,
	previewBlurhash,
	url,
	loggedInURL,
	id,
	isActive,
	className,
	children,
}: BannerProps & { ref?: React.RefObject<HTMLDivElement | null> }) {
	// Banners are hydrated with them being closed, less layout shift
	const [isOpened, setOpened] = useState(false);
	const { user } = useUser("/", false);
	const { isFavourite, toggleFavourite } = useFavourites();

	const link =
		user && loggedInURL
			? loggedInURL

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
			jsonString !== null
				? new Map<string, boolean>(
						JSON.parse(jsonString) as [string, boolean][],
					)
				: new Map<string, boolean>();
		// But when the page loads they are opened if there is no stored value
		setOpened(map.get(url) ?? true);
	}, [url]);

	function saveState(state: boolean) {
		const jsonString = localStorage.getItem("toggledBanners");
		const map =
			jsonString !== null
				? new Map<string, boolean>(
						JSON.parse(jsonString) as [string, boolean][],
					)
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
			className={cn(
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
					<div className="bg-banner-dark flex w-14 items-center p-2 py-4">
						<TrackingLink
							className="relative block h-10 w-10"
							href={link}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`${headerText} link`}
							isExternal
							eventName="banner-icon-click"
							eventData={{ site: headerText }}
						>
							<Image
								src={iconSrc}
								alt={`${headerText} icon`}
								unoptimized
								fill
								sizes="100vw"
								style={{
									objectFit: "cover",
								}}
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
							eventData={{ site: headerText }}
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
					<button
						className="absolute -top-4 -right-4 z-10 rounded-full bg-gray-800/80 p-1 transition-colors hover:bg-gray-700/80"
						type="button"
						onClick={() => {
							toggleFavourite(id);
						}}
						aria-label={
							isFavourite(id) ? "Remove from favourites" : "Add to favourites"
						}
					>
						{isFavourite(id) ? (
							<FaStar className="size-6 text-yellow-400" />
						) : (
							<FaRegStar className="size-6 text-gray-300 hover:text-yellow-400" />
						)}
					</button>
				</div>

				<div
					// style={{ height: "292px" }}
					className={cn(
						"aspect-16/9",
						isOpened ? "block" : "hidden",
						"relative",
					)}
				>
					<Image
						src={previewImage}
						alt={`${headerText} preview`}
						placeholder="blur"
						blurDataURL={previewBlurhash}
						fill
						// width={520}
						// height={292}
						sizes="520px"
						style={{
							objectFit: "cover",
						}}
					/>
				</div>

				<figure className={cn(styles.figure, isOpened ? "block" : "hidden")}>
					<MDXRemote {...children} components={{ h4: H4 }} />
					<TrackingLink
						className={styles.button}
						href={link}
						target="_blank"
						rel="noopener noreferrer"
						isExternal
						eventName="banner-button-click"
						eventData={{ site: headerText }}
					>
						Open
					</TrackingLink>
				</figure>
			</div>
		</article>
	);
});
