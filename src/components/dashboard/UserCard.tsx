import { DestinyCharacterComponent } from "bungie-api-ts/destiny2";
import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";

import {
	ClassIcon,
	StatDisplay,
} from "@/components/dashboard/CharacterComponents";
import { currentCharacter } from "@/utils/bungieApi/utils";
import { useUser } from "@/utils/hooks";
import { useItemDefinitions } from "@/utils/hooks/useItemDefinitions";
import { useRecordDefinitions } from "@/utils/hooks/useRecordDefinitions";
import {
	ALL_STAT_HASHES,
	useAllStatDefinitions,
} from "@/utils/hooks/useStatDefinitions";
import { cn } from "@/utils/utils";

type CharacterCardProps = {
	character: DestinyCharacterComponent | undefined;
};

export function CharacterCard({ character }: CharacterCardProps) {
	const { data: statDefinitions } = useAllStatDefinitions();

	const { data: titleDefinition } = useRecordDefinitions([
		character?.titleRecordHash ?? 0,
	]);

	if (!character)
		return (
			// loading skeleton
			<div className="animate-pulse">
				<div className="bg-blur-10 h-[96px] w-[474px]">
					<div className="absolute top-2 left-2 h-[80px] w-[80px] bg-gray-400/50" />
					<div className="glow absolute top-4 left-[96px] h-10 w-64 overflow-hidden rounded bg-gray-400/50 text-4xl font-medium text-ellipsis" />
					<div className="glow absolute top-4 right-4 h-10 w-20 overflow-hidden rounded bg-gray-400/50 text-4xl font-medium text-ellipsis" />
				</div>
			</div>
		);

	return (
		<Suspense>
			<div className={cn("relative -mx-2 h-[96px] max-w-[474px] sm:-mx-0")}>
				<Image
					width={474}
					height={96}
					src={`https://bungie.net${character.emblemBackgroundPath}`}
					alt="User icon"
					style={{
						maxWidth: "100%",
						height: "auto",
					}}
				/>
				<h3
					className={cn(
						"glow absolute top-4 left-[96px] flex max-w-64 flex-row items-center overflow-hidden text-4xl font-medium text-ellipsis",
					)}
				>
					<ClassIcon
						classType={character.classType}
						className="h-6 w-6 text-white"
					/>
					{character.titleRecordHash &&
						titleDefinition?.records[character.titleRecordHash] && (
							<h5 className="text-title glow ml-4 inline-block text-2xl italic drop-shadow-md drop-shadow-black/50">
								{
									titleDefinition.records[character.titleRecordHash]
										.displayProperties.name
								}
							</h5>
						)}
				</h3>

				<h5 className={cn("absolute bottom-4 left-[96px] text-base")}>
					<div className="flex flex-row gap-2 rounded-t border-b border-gray-300/30 bg-gray-700/20 pr-1 backdrop-blur-xs">
						{ALL_STAT_HASHES.map((statHash) => {
							const stat = statDefinitions?.stats[statHash];
							const value = character.stats[statHash];
							if (stat && value) {
								return (
									<StatDisplay key={statHash} stat={stat} value={value} small />
								);
							}
						})}
					</div>
				</h5>
				<h4
					className={cn(
						"glow light-small absolute top-4 right-4 text-2xl text-yellow-300 tabular-nums",
					)}
				>
					{character.light}
				</h4>
			</div>
		</Suspense>
	);
}

export function UserHeader() {
	const { user } = useUser();
	const character = useMemo(() => {
		return currentCharacter(user?.characters);
	}, [user]);

	const [emblemId, setEmblemId] = useState<number>(character?.emblemHash ?? 0);
	const { data: emblemDefinition } = useItemDefinitions([emblemId]);

	const { data: statDefinitions } = useAllStatDefinitions();

	const { data: titleDefinition } = useRecordDefinitions([
		character?.titleRecordHash ?? 0,
	]);

	console.log(character);
	console.log(titleDefinition);

	useEffect(() => {
		if (user && character) {
			setEmblemId(character.emblemHash);
		}
	}, [character, user]);

	if (!character || !user)
		return (
			// loading skeleton
			<div className="animate-pulse">
				<div className="bg-blur-10 h-[96px] w-[474px]">
					<div className="absolute top-2 left-2 h-[80px] w-[80px] bg-gray-400/50" />
					<div className="glow absolute top-4 left-[96px] h-10 w-64 overflow-hidden rounded bg-gray-400/50 text-4xl font-medium text-ellipsis" />
					<div className="glow absolute top-4 right-4 h-10 w-20 overflow-hidden rounded bg-gray-400/50 text-4xl font-medium text-ellipsis" />
				</div>
			</div>
		);

	return (
		<Suspense>
			<Image
				width={2300}
				height={146}
				src={`https://bungie.net${emblemDefinition?.items[emblemId].secondarySpecial}`}
				alt="User icon"
				className="absolute top-0 left-0 -mt-[65px] h-full max-h-[192px] min-h-[192px] w-full max-w-full object-cover select-none"
			/>

			<div className="relative -mt-[1px] grid h-[128px] grid-cols-[96px_1fr] items-center gap-2 py-4 sm:gap-4">
				<Image
					width={96}
					height={96}
					src={`https://bungie.net${emblemDefinition?.items[emblemId].secondaryOverlay}`}
					alt="User icon"
					className="h-auto w-[96px]"
				/>

				<div className="grid h-full grid-cols-[1fr_auto] gap-2 sm:gap-4">
					<div className="grid w-full grid-rows-[auto_auto]">
						<div className="flex w-full flex-row items-center gap-4">
							<h3
								className={cn(
									"glow max-w-[65vw] overflow-hidden text-4xl font-medium text-ellipsis whitespace-nowrap drop-shadow-md drop-shadow-black/50",
								)}
							>
								{user.profile.userInfo.displayName}
							</h3>
							<ClassIcon
								classType={character.classType}
								className="h-8 w-8 text-white drop-shadow-md drop-shadow-black/50"
							/>
							{character.titleRecordHash &&
								titleDefinition?.records[character.titleRecordHash] && (
									<h4 className="text-title glow inline-block text-4xl italic drop-shadow-md drop-shadow-black/50">
										{
											titleDefinition.records[character.titleRecordHash]
												.displayProperties.name
										}
									</h4>
								)}
						</div>

						<div className="flex w-fit flex-row gap-2 rounded-t border-b border-gray-300/30 bg-gray-700/20 pr-1 backdrop-blur-xs">
							{ALL_STAT_HASHES.map((statHash) => {
								const stat = statDefinitions?.stats[statHash];
								const value = character.stats[statHash];
								if (stat && value) {
									return (
										<StatDisplay key={statHash} stat={stat} value={value} />
									);
								}
							})}
						</div>
					</div>

					<h4
						className={cn("glow light text-4xl text-yellow-300 tabular-nums")}
					>
						{character.light}
					</h4>
				</div>
			</div>
		</Suspense>
	);
}
