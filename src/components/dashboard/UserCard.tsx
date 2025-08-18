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
				<div className="bg-blur-10 h-[96px] w-[474px]">
					<div className="absolute top-2 left-2 h-[80px] w-[80px] bg-gray-400/50" />
					<div className="glow absolute top-4 left-[96px] h-10 w-64 overflow-hidden rounded bg-gray-400/50 text-4xl font-medium text-ellipsis" />
					<div className="glow absolute top-4 right-4 h-10 w-20 overflow-hidden rounded bg-gray-400/50 text-4xl font-medium text-ellipsis" />
				</div>
			</div>
		);

	return (
		<Suspense>
			<div className={cn("relative -mx-2 h-[96px] w-[474px] sm:-mx-0")}>
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
						"glow absolute top-4 left-[96px] w-64 overflow-hidden text-4xl font-medium text-ellipsis",
					)}
				>
					{getClass(character.classType)}
				</h3>
				<h5 className={cn("absolute bottom-4 left-[96px] text-base")}>
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
				src={`https://bungie.net${emblem?.items[emblemId].secondarySpecial}`}
				alt="User icon"
				className="absolute top-0 left-0 -mt-[65px] h-full max-h-[192px] min-h-[192px] w-full max-w-full object-cover select-none"
			/>
			<div className={cn("relative -mx-2 -mt-[1px] h-[128px] sm:-mx-0")}>
				<Image
					width={96}
					height={96}
					src={`https://bungie.net${emblem?.items[emblemId].secondaryOverlay}`}
					alt="User icon"
					className="absolute top-4 left-4 h-auto w-[96px]"
				/>
				<h3
					className={cn(
						"glow absolute top-4 left-[128px] w-64 overflow-hidden text-4xl font-medium text-ellipsis",
					)}
				>
					{user.profile.userInfo.displayName}
				</h3>
				<h5 className={cn("absolute bottom-4 left-[128px] text-base")}>
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
