import clsx from "clsx";
import hydrate from "next-mdx-remote/hydrate";
import type { MdxRemote } from "next-mdx-remote/types";
import React, { ReactNode } from "react";
import { useDrop } from "react-dnd";

import H4 from "@/components/banner/H4";
import type { BannerProps } from "@/pages";

import Banner, { BannerDragType } from "./Banner";
import styles from "./BannerSection.module.scss";

export default function BannerSection({
	banners,
	title,
	searchArray,
}: {
	banners: {
		banner: {
			mdxSource: MdxRemote.Source;
			data: {
				[key: string]: any;
			};
			filePath: string;
		};
		bannerContent: ReactNode;
	}[];
} & {
	title: string;
	searchArray?: {
		banner: {
			mdxSource: MdxRemote.Source;
			data: {
				[key: string]: any;
			};
			filePath: string;
		};
		bannerContent: ReactNode;
	}[];
}) {
	const isFavourites = title === "Favourites";
	const [localBanners, setLocalBanners] = React.useState(banners);
	const [{ isOver }, drop] = useDrop(
		() => ({
			accept: isFavourites ? BannerDragType : "nothing",
			drop: (item: { url: string }, monitor) => {
				console.log(item, searchArray);
				const selected = searchArray?.filter(
					(banner) => banner.banner.data.url === item.url,
				);
				if (selected) localBanners.push(selected[0]);
				setLocalBanners(localBanners);

				console.log(item, selected);
			},
			collect: (monitor) => ({ isOver: !!monitor.isOver() }),
		}),
		[],
	);

	React.useEffect(() => {
		console.log("asd: ", localBanners);
		return () => {};
	}, [localBanners]);
	return (
		<>
			<h2 className={styles.headerText}>{title}</h2>
			<section className={clsx(styles.bannerSection)} ref={drop}>
				{localBanners.map((banner) => {
					return (
						// @ts-expect-error: Banners props should always be the same as the data in the mdx's.
						<Banner
							key={banner.banner.data.url}
							forceClosed={isFavourites}
							{...banner.banner.data}
						>
							{banner.bannerContent}
						</Banner>
					);
				})}
				{isFavourites && (
					<div className={clsx(styles.placeholder, "bg-blur-10")}>
						Drag & drop banners here to add them to favourites.
					</div>
				)}
			</section>
		</>
	);
}
