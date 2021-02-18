import fs from "fs";
import matter from "gray-matter";
import type { InferGetStaticPropsType } from "next";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import path from "path";

import Banner from "@/components/banner/Banner";
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

export default function Index({
	banners,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<Layout className="mb-8 mt-20 mx-auto px-3 sm:mt-28 sm:px-8 md:px-12 lg:mt-32 lg:px-16 xl:px-32">
			<section className="grid gap-8 grid-cols-1 2xl:grid-cols-3 justify-items-center md:grid-cols-2">
				{banners.map((banner) => {
					const content = hydrate(banner.mdxSource, {});
					return (
						<Banner key={banner.filePath} {...banner.data}>
							{content}
						</Banner>
					);
				})}
			</section>
		</Layout>
	);
}
