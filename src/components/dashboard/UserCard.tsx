import { DestinyCharacterComponent } from "bungie-api-ts/destiny2";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";

import { currentCharacter, getClass } from "@/utils/bungieApi/utils";
import { useUser } from "@/utils/hooks";
import { useItemDefinitions } from "@/utils/hooks/useItemDefinitions";
import { cn } from "@/utils/utils";

type CharacterCardProps = {
	character: DestinyCharacterComponent | undefined;
};

export function CharacterCard({ character }: CharacterCardProps) {
	const [emblemId, setEmblemId] = useState<number>(character?.emblemHash ?? 0);

	const { data: emblem } = useItemDefinitions([emblemId]);

	useEffect(() => {
		if (character) {
			setEmblemId(character.emblemHash);
		}
	}, [character]);

	console.log(emblem);

	if (!character)
		return (
			// loading skeleton
			<div className="animate-pulse">
				<div className="w-[474px] h-[96px] bg-blur-10">
					<div className="absolute left-2 top-2 w-[80px] h-[80px] bg-gray-400/50" />
					<div className="glow left-[96px] font-medium absolute rounded bg-gray-400/50 top-4 w-64 h-10 overflow-hidden text-ellipsis text-4xl" />
					<div className="glow right-4 font-medium absolute rounded bg-gray-400/50 top-4 w-20 h-10 overflow-hidden text-ellipsis text-4xl" />
				</div>
			</div>
		);

	return (
		<Suspense>
			<div className={cn("relative w-[474px] h-[96px]", "-mx-2 sm:-mx-0")}>
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
						"glow left-[96px] font-medium absolute top-4 w-64 overflow-hidden text-ellipsis text-4xl",
					)}
				>
					{getClass(character.classType)}
				</h3>
				<h5 className={cn("left-[96px] absolute bottom-4 text-base")}>
					{getClass(character.classType)}
				</h5>
				<h4
					className={cn(
						"glow light absolute top-4 right-4 text-4xl text-yellow-300",
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

	const [emblemId, setEmblemId] = useState<number>(
		currentCharacter(user?.characters)?.emblemHash ?? 0,
	);

	const { data: emblem } = useItemDefinitions([emblemId]);

	useEffect(() => {
		if (user) {
			setEmblemId(currentCharacter(user.characters)?.emblemHash ?? 0);
		}
	}, [user]);

	console.log(emblem);

	if (!user)
		return (
			// loading skeleton
			<div className="animate-pulse">
				<div className="w-[474px] h-[96px] bg-blur-10">
					<div className="absolute left-2 top-2 w-[80px] h-[80px] bg-gray-400/50" />
					<div className="glow left-[96px] font-medium absolute rounded bg-gray-400/50 top-4 w-64 h-10 overflow-hidden text-ellipsis text-4xl" />
					<div className="glow right-4 font-medium absolute rounded bg-gray-400/50 top-4 w-20 h-10 overflow-hidden text-ellipsis text-4xl" />
				</div>
			</div>
		);

	return (
		<Suspense>
			<Image
				width={2300}
				height={146}
				src={`https://bungie.net${emblem?.items[emblemId].secondarySpecial}`}
				alt="User icon"
				className="absolute top-0 left-0 w-full h-full object-cover max-w-full min-h-48 max-h-48 -mt-[65px]"
			/>
			<div className={cn("relative h-[96px]", "-mx-2 sm:-mx-0")}>
				<Image
					width={96}
					height={96}
					src={`https://bungie.net${emblem?.items[emblemId].secondaryOverlay}`}
					alt="User icon"
					className="absolute top-4 left-4 w-[96px] h-auto"
				/>
				<h3
					className={cn(
						"glow left-[128px] font-medium absolute top-4 w-64 overflow-hidden text-ellipsis text-4xl",
					)}
				>
					{user.profile.userInfo.displayName}
				</h3>
				<h5 className={cn("left-[128px] absolute bottom-4 text-base")}>
					{getClass(currentCharacter(user.characters)?.classType)}
				</h5>
				<h4
					className={cn(
						"glow light absolute top-4 right-4 text-4xl text-yellow-300",
					)}
				>
					{currentCharacter(user.characters)?.light}
				</h4>
			</div>
		</Suspense>
	);
}
