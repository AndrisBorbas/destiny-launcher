import fs from "fs";
import matter from "gray-matter";
import { InferGetStaticPropsType } from "next";
import path from "path";
import { useMemo } from "react";

import { BannerDataTypes } from "@/@types/DataTypes";
import { BannerPins } from "@/components/banner/BannerPins";
import { FavoriteBanners } from "@/components/dashboard/FavoriteBanners";
import { Currencies } from "@/components/dashboard/Inventory";
import { CharacterCard, UserHeader } from "@/components/dashboard/UserCard";
import { Layout } from "@/components/layout/Layout";
import { Notices } from "@/components/notice/Notices";
import { fetchAllItemDefinitionsServer } from "@/utils/bungieApi/itemDefinitions";
import { fetchAllStatDefinitionsServer } from "@/utils/bungieApi/statDefinitions";
import { currentCharacter } from "@/utils/bungieApi/utils";
import { useUser } from "@/utils/hooks";
import { populateItemCache } from "@/utils/hooks/useItemDefinitions";
import { populateStatCache } from "@/utils/hooks/useStatDefinitions";
import { BANNERS_PATH, bannersFilePaths } from "@/utils/mdxUtils";

export const getStaticProps = async () => {
	// Fetch definitions on the server and populate caches
	const [statDefinitions, itemDefinitions] = await Promise.all([
		fetchAllStatDefinitionsServer(),
		fetchAllItemDefinitionsServer(),
	]);

	populateStatCache(statDefinitions);
	populateItemCache(itemDefinitions);

	const rawBanners = await Promise.all(
		bannersFilePaths.map(async (filePath) => {
			const source = fs.readFileSync(path.join(BANNERS_PATH, filePath));
			const { data } = matter(source) as unknown as {
				data: BannerDataTypes;
			};

			if (data.category === "manager") data.order *= 10;
			if (data.category === "info") data.order *= 1000;
			if (data.category === "sheet") data.order *= 100000;

			return {
				data,
				filePath,
			};
		}),
	);

	rawBanners.sort((a, b) => {
		return a.data.order > b.data.order ? 1 : -1;
	});

	const allBanners = rawBanners.map((banner, i) => {
		return {
			id: banner.filePath,
			index: i,
			data: {
				...banner.data,
			},
		};
	});

	const quickLaunchBanners = allBanners.filter(
		(banner) => banner.data.isQuickLaunch === true,
	);

	return {
		props: {
			quickLaunchBanners,
			allBanners,
			buildDate: Date.now(),
		},
	};
};

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function DashboardPage({
	quickLaunchBanners,
	allBanners,
	buildDate,
}: PageProps) {
	const { user } = useUser();

	const characters = useMemo(() => {
		return Object.values(user?.characters ?? {}).filter(
			(character) =>
				character.characterId !==
				currentCharacter(user?.characters)?.characterId,
		);
	}, [user]);

	return (
		<Layout
			className="safe-area-x mx-auto mb-8 flex max-w-[1920px] flex-col sm:px-4 md:px-8 lg:px-12 xl:px-16"
			buildDate={buildDate}
		>
			<div className="absolute top-[60px] right-0 left-0 w-full max-w-full">
				<Notices />
			</div>

			<UserHeader />

			<div className="relative mt-8 flex flex-col-reverse gap-8 lg:grid lg:grid-cols-[auto_3fr_2fr]">
				<div className="flex flex-col gap-8">
					<BannerPins banners={quickLaunchBanners} />
					{characters.map((character) => (
						<CharacterCard key={character.characterId} character={character} />
					))}
				</div>

				<div className="flex flex-col gap-4">
					<Currencies />
				</div>

				<FavoriteBanners allBanners={allBanners} />
			</div>
		</Layout>
	);
}
