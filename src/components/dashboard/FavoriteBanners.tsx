import Image from "next/image";
import { useMemo } from "react";
import { FaGripVertical, FaRegStar, FaStar } from "react-icons/fa";
import { HiExternalLink } from "react-icons/hi";

import { BannerDataTypes } from "@/@types/DataTypes";
import { TrackingLink } from "@/components/link/TrackingLink";
import { currentCharacter, getPlatformCode } from "@/utils/bungieApi/utils";
import { useFavourites, useUser } from "@/utils/hooks";
import { cn } from "@/utils/utils";

import styles from "../banner/Banner.module.css";

type FavoriteBannersProps = {
	allBanners: {
		id: string;
		index: number;
		data: BannerDataTypes;
	}[];
};

export function FavoriteBanners({ allBanners }: FavoriteBannersProps) {
	const { user } = useUser();
	const { favourites, isFavourite, toggleFavourite } = useFavourites();

	const favouriteBanners = useMemo(() => {
		return allBanners.filter((banner) => favourites.includes(banner.id));
	}, [allBanners, favourites]);

	if (!user || favouriteBanners.length === 0) {
		return (
			<div className="flex h-fit flex-row flex-wrap gap-4 rounded-t border-b border-gray-300/30 bg-gray-700/20 p-4 backdrop-blur">
				<div className="flex w-full items-center justify-center text-sm text-gray-400">
					<FaStar className="mr-2 size-4" />
					No favorite banners yet. Star banners on the main page to add them
					here!
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-row flex-wrap justify-center gap-4 rounded-t border-b border-gray-300/30 bg-gray-700/20 p-2 pr-1 backdrop-blur">
			<div className="flex items-center px-2 py-1 text-sm font-medium text-gray-300">
				<FaStar className="mr-2 size-4 text-yellow-400" />
				Favorites
			</div>
			{favouriteBanners.map((banner) => {
				const link = banner.data.loggedInURL
					? banner.data.loggedInURL
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
					: banner.data.url;

				return (
					<div key={banner.id} className={cn(styles.container, "w-full")}>
						<div
							className={cn(
								styles.header,
								"mr-1 !grid-cols-[56px_1fr_auto_32px]",
							)}
						>
							<div className="bg-banner-dark flex w-14 items-center p-2 py-4">
								<TrackingLink
									className="relative block h-10 w-10"
									href={link}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`${banner.data.headerText} link`}
									isExternal
									eventName="banner-icon-click"
									eventData={{ site: banner.data.headerText }}
								>
									<Image
										src={banner.data.iconSrc}
										alt={`${banner.data.headerText} icon`}
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
									eventData={{ site: banner.data.headerText }}
									className="w-full"
								>
									<span className="mr-2">{banner.data.headerText}</span>
									<span className="inline-block">
										<HiExternalLink className="h-6 w-6" />
									</span>
								</TrackingLink>
							</h3>

							<FaGripVertical
								className="cursor-not-allowed self-center text-2xl"
								// {...listeners}
							/>

							<button
								className="h-fit w-fit self-center rounded-full bg-gray-800/80 p-1 transition-colors hover:bg-gray-700/80"
								type="button"
								onClick={() => {
									toggleFavourite(banner.id);
								}}
								aria-label={
									isFavourite(banner.id)
										? "Remove from favourites"
										: "Add to favourites"
								}
							>
								{isFavourite(banner.id) ? (
									<FaStar className="size-6 text-yellow-400" />
								) : (
									<FaRegStar className="size-6 text-gray-300 hover:text-yellow-400" />
								)}
							</button>
						</div>
					</div>
				);
			})}
		</div>
	);
}
