import fs from "fs";
import matter from "gray-matter";
import type { InferGetStaticPropsType } from "next";
import renderToString from "next-mdx-remote/render-to-string";
import path from "path";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

import type { BannerDataTypes } from "@/@types/DataTypes";
import BannerSection from "@/components/banner/BannerSection";
import FAQ from "@/components/faq/FAQ";
import Layout from "@/components/Layout";
import { BANNERS_PATH, bannersFilePaths } from "@/utils/mdxUtils";

export const getStaticProps = async () => {
	const rawBanners = await Promise.all(
		bannersFilePaths.map(async (filePath) => {
			const source = fs.readFileSync(path.join(BANNERS_PATH, filePath));
			const { content, data } = (matter(source) as unknown) as {
				content: string;
				data: BannerDataTypes;
			};

			const mdxSource = await renderToString(content, {
				scope: data,
			});

			if (data.category === "manager") data.order *= 10;
			if (data.category === "info") data.order *= 1000;
			if (data.category === "sheet") data.order *= 100000;

			return {
				content: mdxSource,
				data,
				filePath,
			};
		}),
	);

	rawBanners.sort((a, b) => {
		return a.data.order > b.data.order ? 1 : -1;
	});

	const banners = rawBanners.map((banner, i) => {
		return {
			id: banner.filePath,
			index: i,
			data: banner.data,
			content: banner.content,
		};
	});

	return { props: { banners } };
};

export type BannerProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function Index({ banners }: BannerProps) {
	const [isVisible, toggleVisible] = useState(false);

	useEffect(() => {
		const jsonString = localStorage.getItem("isBanner1");
		const value = jsonString != null ? JSON.parse(jsonString) : true;
		toggleVisible(value);
		return () => {};
	}, []);

	return (
		<Layout className="safe-area-x flex flex-col mb-8 mx-auto sm:px-4 md:px-8 lg:px-12 xl:px-16">
			<div
				style={{ display: isVisible === true ? "block" : "none" }}
				className="hidden mt-8 md:block"
			>
				<h3 className="w-fit relative mx-auto p-6 px-9 text-center text-xl bg-button border-t border-gray-300">
					New feature: favoriting and reordering
					<button
						className="absolute right-1 top-1 p-1"
						type="button"
						onClick={() => {
							localStorage.setItem("isBanner1", JSON.stringify(false));
							toggleVisible(false);
						}}
					>
						<FaTimes />
					</button>
				</h3>
			</div>
			<BannerSection banners={banners} />
			<FAQ />
		</Layout>
	);
}
