import hydrate from "next-mdx-remote/hydrate";
import React from "react";

import H4 from "@/components/banner/H4";
import type { BannerProps } from "@/pages";

import Banner from "./Banner";
import styles from "./BannerSection.module.scss";

export default function BannerSection({
	banners,
	title,
}: BannerProps & { title: string }) {
	return (
		<>
			<h2 className={styles.headerText}>{title}</h2>
			<section className="grid gap-8 grid-cols-1 2xl:grid-cols-3 justify-items-center lg:grid-cols-2">
				{banners.map((banner) => {
					const bannerContent = hydrate(banner.mdxSource, {
						components: { h4: H4 },
					});
					return (
						// @ts-expect-error: Banners props should always be the same as the data in the mdx's.
						<Banner key={banner.filePath} {...banner.data}>
							{bannerContent}
						</Banner>
					);
				})}
			</section>
		</>
	);
}
