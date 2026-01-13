import Image from "next/image";
import { HiExternalLink } from "react-icons/hi";

import { BannerDataTypes } from "@/@types/DataTypes";
import { TrackingLink } from "@/components/link/TrackingLink";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { currentCharacter, getPlatformCode } from "@/utils/bungieApi/utils";
import { useUser } from "@/utils/hooks";

type BannerPinProps = {
	banners: {
		id: string;
		index: number;
		data: BannerDataTypes;
	}[];
};

export function BannerPins({ banners }: BannerPinProps) {
	const { user } = useUser();
	if (!user) return null;
	return (
		<div className="flex flex-row flex-wrap gap-4 rounded-t border-b border-gray-300/30 bg-gray-700/20 p-2 pr-1 backdrop-blur">
			{banners.map((banner) => {
				const link = banner.data.loggedInURL
					?.replace("{Profile}", user.profile.userInfo.membershipId)
					.replace("{Clan}", user.clan?.group.groupId ?? "")
					.replace(
						"{Platform}",
						user.profile.userInfo.membershipType.toString(),
					)
					.replace(
						"{Platform2Code}",
						getPlatformCode(user.profile.userInfo.membershipType, 0),
					)
					.replace(
						"{Character}",
						currentCharacter(user.characters)?.characterId ?? "",
					);

				if (!link) {
					return null;
				}

				return (
					<div key={banner.id} className="relative flex flex-row">
						<Tooltip>
							<TooltipTrigger asChild>
								<TrackingLink
									className="relative block h-8 w-8"
									href={link}
									target="_blank"
									aria-label={`${banner.data.headerText} link`}
									isExternal
									eventName="Banner_Pin_Click"
									eventData={{ site: banner.data.headerText }}
								>
									<Image
										src={banner.data.iconSrc}
										alt={`${banner.data.headerText} icon`}
										unoptimized
										fill
										sizes="100vw"
										style={{
											objectFit: "cover",
										}}
									/>
								</TrackingLink>
							</TooltipTrigger>
							<TooltipContent>
								<p>
									<span className="mr-2 text-lg">{banner.data.headerText}</span>
									<span className="inline-block align-text-bottom">
										<HiExternalLink className="h-5 w-5" />
									</span>
								</p>
							</TooltipContent>
						</Tooltip>
					</div>
				);
			})}
		</div>
	);
}
