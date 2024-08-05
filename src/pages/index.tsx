import fs from "fs";
import matter from "gray-matter";
import type { InferGetStaticPropsType } from "next";
import Link from "next/link";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import { getPlaiceholder } from "plaiceholder";
import { mutate } from "swr";

import type { BannerDataTypes } from "@/@types/DataTypes";
import { BannerSection } from "@/components/banner/BannerSection";
import { FAQ } from "@/components/faq/FAQ";
import { SeasonInfo } from "@/components/info/SeasonInfo";
import { Layout } from "@/components/layout/Layout";
import { TrackingLink } from "@/components/link/TrackingLink";
import { Notice } from "@/components/notice/Notice";
import { getInitialD2Info } from "@/utils/bungieApi/destiny2-api-server";
import { d2InfoKey, d2InfoRoute, d2UserKey } from "@/utils/hooks";
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
			const buffer = await fs.readFileSync(path.join("./public", banner.data.previewImage));
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
		<Layout
			className="safe-area-x relative mx-auto mb-8 flex flex-col sm:px-4 md:px-8 lg:px-12 xl:px-16"
			buildDate={buildDate}
		>
			<section className={styles.notices}>
				<Notice id="notice9" className="">
					<h3 className="text-lg font-medium">
						Update: New seasonal background
					</h3>
					<p className="text-xs text-gray-200">
						If the site is lagging, You can disable it{" "}
						<Link
							href="/#animateToggle"
							className="mt-2 underline decoration-yellow-300 hover:underline-offset-2"
						>
							in the footer.
							<br />
						</Link>
					</p>
				</Notice>
				<Notice id="notice10" className="">
					<h2 className="">Future:</h2>
					<p className="text-base">
						I plan on adding a dashboard page where you can pin your favourite
						sites, see your in-game stats and progress and have access to
						destiny related news and updates.
					</p>

					<p className="mt-2 text-sm">
						Please{" "}
						<TrackingLink
							href="https://ko-fi.com/andrisborbas"
							className="underline decoration-yellow-300 hover:underline-offset-2"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Ko-fi link"
							isExternal
							eventName="notice-link-click"
						>
							consider supporting
						</TrackingLink>{" "}
						if you like this project, so the site can keep running ad-free.
					</p>
				</Notice>
			</section>
			<SeasonInfo initialData={d2info} />
			<BannerSection banners={banners} />
			<FAQ />
		</Layout>
	);
}
