import { InferGetStaticPropsType } from "next";
import { useMemo } from "react";

import { CharacterCard, UserHeader } from "@/components/dashboard/UserCard";
import { Layout } from "@/components/layout/Layout";
import { getInitialD2Info } from "@/utils/bungieApi/destiny2-api-server";
import { currentCharacter } from "@/utils/bungieApi/utils";
import { useUser } from "@/utils/hooks";

export const getStaticProps = async () => {
	// const d2info = await getInitialD2Info(false);

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
		//create an array from characters object
		return Object.values(user?.characters ?? {})
			.filter(
				(character) =>
					character.characterId !==
					currentCharacter(user?.characters)?.characterId,
			)
			.map((character) => ({
				...character,
			}));
	}, [user]);

	return (
		<Layout
			className="safe-area-x relative mx-auto mb-8 flex flex-col sm:px-4 md:px-8 lg:px-12 xl:px-16"
			buildDate={buildDate}
		>
			<UserHeader />

			<div className="mt-12">
				{characters.map((character) => (
					<CharacterCard key={character.characterId} character={character} />
				))}
			</div>
		</Layout>
	);
}
