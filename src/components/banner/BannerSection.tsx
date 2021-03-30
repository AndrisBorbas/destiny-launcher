import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import hydrate from "next-mdx-remote/hydrate";
import type { MdxRemote } from "next-mdx-remote/types";
import React from "react";

import H4 from "@/components/banner/H4";
import type { BannerProps } from "@/pages";

import Banner from "./Banner";
import styles from "./BannerSection.module.scss";

export default function BannerSection({
	banners,
	category,
	title,
}: {
	banners: {
		content: React.ReactNode;
		mdxSource: MdxRemote.Source;
		data: {
			[key: string]: any;
		};
		filePath: string;
	}[];
} & { category: string; title: string }) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id: `${category} placeholder` });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<>
			<h2 className={styles.headerText}>{title}</h2>
			<section className={styles.bannerSection}>
				{banners.map((banner) => {
					if (banner.data.category !== category) return null;

					return (
						// @ts-expect-error: Banners props should always be the same as the data in the mdx's.
						<Banner
							key={banner.filePath}
							id={`${banner.data.category} ${banner.data.url}`}
							{...banner.data}
						>
							{banner.content}
						</Banner>
					);
				})}
				{category === "favourites" && (
					<article
						className={clsx(styles.placeholder, "bg-blur-10")}
						ref={setNodeRef}
						// @ts-expect-error: No idea
						style={style}
						{...attributes}
						{...listeners}
					>
						Drag & drop banners here to add them to favourites.
					</article>
				)}
			</section>
		</>
	);
}
