import fs from "fs";
import matter from "gray-matter";
import type { InferGetStaticPropsType } from "next";
import renderToString from "next-mdx-remote/render-to-string";
import path from "path";
import React from "react";

import BannerContext from "@/components/banner/BannerContext";
import FAQ from "@/components/faq/FAQ";
import Layout from "@/components/Layout";
import { BANNERS_PATH, bannersFilePaths } from "@/utils/mdxUtils";

export const getStaticProps = async () => {
	const banners = await Promise.all(
		bannersFilePaths.map(async (filePath) => {
			const source = fs.readFileSync(path.join(BANNERS_PATH, filePath));
			const { content, data } = matter(source);

			const mdxSource = await renderToString(content, {
				scope: data,
			});

			return {
				mdxSource,
				data,
				filePath,
			};
		}),
	);

	banners.sort((a, b) => {
		let asum = a.data.order;
		if (a.data.category === "manager") asum *= 100;
		if (a.data.category === "info") asum *= 10000;
		if (a.data.category === "sheet") asum *= 1000000;

		let bsum = b.data.order;
		if (b.data.category === "manager") bsum *= 100;
		if (b.data.category === "info") bsum *= 10000;
		if (b.data.category === "sheet") bsum *= 1000000;
		return asum > bsum ? 1 : -1;
	});

	return { props: { banners } };
};

export type BannerProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function Index({ banners }: BannerProps) {
	return (
		<Layout className="safe-area-x flex flex-col mb-8 mx-auto sm:px-4 md:px-8 lg:px-12 xl:px-16">
			<BannerContext banners={banners} />
			<FAQ />
		</Layout>
	);
}
