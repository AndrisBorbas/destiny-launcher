import fs from "fs";
import matter from "gray-matter";
import type { InferGetStaticPropsType } from "next";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import React, { useEffect, useState } from "react";

import type { BannerDataTypes } from "@/@types/DataTypes";
import BannerSection from "@/components/banner/BannerSection";
import FAQ from "@/components/faq/FAQ";
import SeasonInfo from "@/components/info/SeasonInfo";
import Layout from "@/components/Layout";
import Notice from "@/components/notice/Notice";
import {
	getManifest,
	getSettings,
	getSlice,
} from "@/utils/bungieApi/destiny2-api-client";
import getInitialD2Info from "@/utils/bungieApi/destiny2-api-server";
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

	const banners = rawBanners.map((banner, i) => {
		return {
			id: banner.filePath,
			index: i,
			data: banner.data,
			content: banner.content,
		};
	});

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
	const [d2InfoState, setD2InfoState] = useState(d2info);
	useEffect(() => {
		async function loadManifest() {
			const manifest = await getManifest();

			if (d2info.version !== manifest.version) {
				const manifestTables = await getSlice(manifest, [
					"DestinySeasonDefinition",
					"DestinyPresentationNodeDefinition",
				]);
				const commonSettings = await getSettings();

				setD2InfoState({
					version: manifest.version,
					allSeasons: manifestTables.DestinySeasonDefinition,
					presentationNodes: manifestTables.DestinyPresentationNodeDefinition,
					commonSettings,
				});
			}
		}

		loadManifest();

		return () => {};
	}, [d2info.version]);

	return (
		<Layout className="safe-area-x relative flex flex-col mb-8 mx-auto sm:px-4 md:px-8 lg:px-12 xl:px-16">
			<section className={styles.notices}>
				<Notice id="notice4" className="mt-8">
					<h2 className="mb-1">New sheet:</h2>
					Destiny Data Compendium - Detailed info on abilities data.
				</Notice>
			</section>
			<SeasonInfo {...d2InfoState} />
			<BannerSection banners={banners} />
			<FAQ />
		</Layout>
	);
}
