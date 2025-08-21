import fs from "fs";
import matter from "gray-matter";
import type { InferGetStaticPropsType } from "next";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import { getPlaiceholder } from "plaiceholder";
import { mutate } from "swr";

import type { BannerDataTypes } from "@/@types/DataTypes";
import { BannerSection } from "@/components/banner/BannerSection";
import { FAQ } from "@/components/faq/FAQ";
import { SeasonInfo } from "@/components/info/SeasonInfo";
import { Layout } from "@/components/layout/Layout";
import { Notices } from "@/components/notice/Notices";
import { getInitialD2Info } from "@/utils/bungieApi/destiny2-api-server";
import { d2InfoKey, d2InfoRoute, d2UserKey } from "@/utils/hooks";
import { BANNERS_PATH, bannersFilePaths } from "@/utils/mdxUtils";

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
			const buffer = fs.readFileSync(
				path.join("./public", banner.data.previewImage),
			);
			const { base64 } = await getPlaiceholder(buffer);

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
			buildDate: Date.now(),
		},
	};
};

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function Index({ banners, d2info, buildDate }: PageProps) {
	// console.log({ banners, d2info });

	if (typeof window === "undefined") {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (d2info) void mutate(d2InfoRoute, d2info, false);
	} else {
		const info = localStorage.getItem(d2InfoKey);
		if (info) void mutate(d2InfoRoute, JSON.parse(info), false);
	}
	if (typeof window !== "undefined") {
		const user = localStorage.getItem(d2UserKey);
		if (user) void mutate(d2UserKey, JSON.parse(user), false);
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
		<Layout
			className="safe-area-x relative mx-auto mb-8 flex flex-col sm:px-4 md:px-8 lg:px-12 xl:px-16"
			buildDate={buildDate}
		>
			<Notices />
			<SeasonInfo initialData={d2info} />
			<BannerSection banners={banners} />
			<FAQ />
		</Layout>
	);
}
