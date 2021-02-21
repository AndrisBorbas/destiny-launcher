import fs from "fs";
import matter from "gray-matter";
import type { InferGetStaticPropsType } from "next";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import path from "path";

import Banner from "@/components/banner/Banner";
import H4 from "@/components/banner/H4";
import Layout from "@/components/Layout";
import { BANNERS_PATH, bannersFilePaths } from "@/utils/mdxUtils";

import styles from "./index.module.scss";

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
		<Layout className="safe-area-x flex flex-col mb-8 mx-auto sm:px-8 md:px-12 lg:px-16 xl:px-32">
			<h2 className={styles.headerText}>Account Managers</h2>
			<section className="grid gap-8 grid-cols-1 2xl:grid-cols-3 justify-items-center md:grid-cols-2">
				{banners.map((banner) => {
					const content = hydrate(banner.mdxSource, {
						components: { h4: H4 },
					});
					return (
						// @ts-expect-error: Banners props should always be the same as the data in the mdx's.
						<Banner key={banner.filePath} {...banner.data}>
							{content}
						</Banner>
					);
				})}
			</section>
		</Layout>
	);
}
