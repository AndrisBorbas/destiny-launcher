import fs from "fs";
import matter from "gray-matter";
import type { InferGetStaticPropsType } from "next";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import { getPlaiceholder } from "plaiceholder";
import React, { useEffect } from "react";
import { mutate } from "swr";

import type { BannerDataTypes } from "@/@types/DataTypes";
import BannerSection from "@/components/banner/BannerSection";
import FAQ from "@/components/faq/FAQ";
import SeasonInfo from "@/components/info/SeasonInfo";
import Layout from "@/components/Layout";
import Notice from "@/components/notice/Notice";
import { getInitialD2Info } from "@/utils/bungieApi/destiny2-api-server";
import { dedupePromise } from "@/utils/bungieApi/utils";
import { d2InfoKey, d2InfoRoute, d2UserKey, useUser } from "@/utils/hooks";
import { BANNERS_PATH, bannersFilePaths } from "@/utils/mdxUtils";

import styles from "./index.module.scss";

export const getStaticProps = async () => {
	const rawBanners = await Promise.all(
		bannersFilePaths.map(async (filePath) => {
			const source = fs.readFileSync(path.join(BANNERS_PATH, filePath));
			const { content, data } = matter(source) as unknown as {
				content: string;
				data: BannerDataTypes;
			};

			const mdxSource = await serialize(content, { scope: data });

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

	const banners = await Promise.all(
		rawBanners.map(async (banner, i) => {
			const { base64 } = await getPlaiceholder(banner.data.previewImage);

			return {
				id: banner.filePath,
				index: i,
				data: {
					...banner.data,
					previewBlurhash: base64,
				},
				content: banner.content,
			};
		}),
	);

	const d2info = await getInitialD2Info(true);

	return {
		props: {
			banners,
			d2info,
		},
	};
};

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function Index({ banners, d2info }: PageProps) {
	if (typeof window === "undefined") {
		if (d2info) mutate(d2InfoRoute, d2info, false);
	} else {
		const info = localStorage.getItem(d2InfoKey);
		if (info) mutate(d2InfoRoute, JSON.parse(info), false);
	}
	if (typeof window !== "undefined") {
		const user = localStorage.getItem(d2UserKey);
		if (user) mutate(d2UserKey, JSON.parse(user), false);
	}

	/*	useEffect(() => {
		const refresh = dedupePromise((): Promise<Response> => {
			return Promise.resolve(fetch("/api/auth/refresh"));
		});
		if (user) {
			console.log(user);
		}
		if (error && error.name === "AuthError") {
			console.error(error);
			refresh();
		}
		return () => {};
	}, [user, error]); */

	return (
		<Layout className="safe-area-x relative flex flex-col mb-8 mx-auto sm:px-4 md:px-8 lg:px-12 xl:px-16">
			<section className={styles.notices}>
				<Notice id="notice5" className="mt-8">
					<h2 className="mb-1 font-semibold">New feature:</h2>
					<h3>Login to have personalized links to sites.</h3>
				</Notice>
			</section>
			<SeasonInfo initialData={d2info} />
			<BannerSection banners={banners} />
			<FAQ />
		</Layout>
	);
}
