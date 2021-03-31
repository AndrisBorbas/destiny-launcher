import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import type { MdxRemote } from "next-mdx-remote/types";
import React from "react";

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
		setNodeRef: sortableRef,
		transform,
		transition,
	} = useSortable({ id: `${category} placeholder` });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const { setNodeRef: droppableRef } = useDroppable({
		id: `${category} container`,
	});

	return (
		<>
			<h2 className={styles.headerText}>{title}</h2>
			<section ref={droppableRef} className={styles.bannerSection}>
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
			</section>
		</>
	);
}
