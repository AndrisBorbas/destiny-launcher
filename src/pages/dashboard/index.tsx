import { InferGetStaticPropsType } from "next";
import { useMemo } from "react";

import { CharacterCard, UserHeader } from "@/components/dashboard/UserCard";
import { Layout } from "@/components/layout/Layout";
import { fetchAllItemDefinitionsServer } from "@/utils/bungieApi/itemDefinitions";
import { fetchAllStatDefinitionsServer } from "@/utils/bungieApi/statDefinitions";
import { currentCharacter } from "@/utils/bungieApi/utils";
import { useUser } from "@/utils/hooks";
import { populateItemCache } from "@/utils/hooks/useItemDefinitions";
import { populateStatCache } from "@/utils/hooks/useStatDefinitions";

export const getStaticProps = async () => {
	// const d2info = await getInitialD2Info(false);

	// Fetch definitions on the server and populate caches
	const [statDefinitions, itemDefinitions] = await Promise.all([
		fetchAllStatDefinitionsServer(),
		fetchAllItemDefinitionsServer(),
	]);

	populateStatCache(statDefinitions);
	populateItemCache(itemDefinitions);

	return {
		props: {
			// d2info,
			buildDate: Date.now(),
		},
	};
};

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function DashboardPage({ buildDate }: PageProps) {
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
			className="safe-area-x relative mx-auto mb-8 flex flex-col sm:px-4 md:px-8 lg:px-12 xl:px-16"
			buildDate={buildDate}
		>
			<UserHeader />

			<div className="mt-4 flex flex-col gap-4">
				{characters.map((character) => (
					<CharacterCard key={character.characterId} character={character} />
				))}
			</div>
		</Layout>
	);
}
