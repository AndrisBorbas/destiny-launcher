import fs from "fs";
import matter from "gray-matter";
import type { InferGetStaticPropsType } from "next";
import renderToString from "next-mdx-remote/render-to-string";
import path from "path";

import BannerSection from "@/components/banner/BannerSection";
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

	return { props: { banners } };
};

export type BannerProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function Index({ banners }: BannerProps) {
	const managers = banners.filter(
		(bannner) => bannner.data.category === "manager",
	);
	managers.sort((a, b) => {
		return a.data.order > b.data.order ? 1 : -1;
	});

	const informational = banners.filter(
		(bannner) => bannner.data.category === "info",
	);
	informational.sort((a, b) => {
		return a.data.order > b.data.order ? 1 : -1;
	});

	return (
		<Layout className="safe-area-x flex flex-col mb-8 mx-auto sm:px-8 md:px-12 lg:px-16 xl:px-32">
			<BannerSection banners={managers} title="Account Managers" />
			<BannerSection banners={informational} title="Informational sites" />
			<FAQ />
		</Layout>
	);
}
