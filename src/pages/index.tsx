import fs from "fs";
import matter from "gray-matter";
import type { InferGetStaticPropsType } from "next";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import type { MdxRemote } from "next-mdx-remote/types";
import path from "path";

import BannerSection from "@/components/banner/BannerSection";
import H4 from "@/components/banner/H4";
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
	banners.sort((a, b) => {
		return a.data.order > b.data.order ? 1 : -1;
	});

	const hydratedBanners = banners.map((banner) => {
		const bannerContent = hydrate(banner.mdxSource, {
			components: { h4: H4 },
		});
		return { banner, bannerContent };
	});

	const managers = hydratedBanners.filter(
		(banner) => banner.banner.data.category === "manager",
	);

	const informational = hydratedBanners.filter(
		(banner) => banner.banner.data.category === "info",
	);

	const sheets = hydratedBanners.filter(
		(banner) => banner.banner.data.category === "sheet",
	);

	const favourites = hydratedBanners.filter(
		(banner) => banner.banner.data.url === "https://braytech.org/ disabled",
	);

	return (
		<Layout className="safe-area-x flex flex-col mb-8 mx-auto sm:px-4 md:px-8 lg:px-12 xl:px-16">
			<BannerSection
				banners={favourites}
				searchArray={hydratedBanners}
				title="Favourites"
			/>
			<BannerSection banners={managers} title="Account Managers" />
			<BannerSection banners={informational} title="Informational sites" />
			<BannerSection banners={sheets} title="Community spreadsheets" />
			<FAQ />
		</Layout>
	);
}
