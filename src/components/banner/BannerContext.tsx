import {
	closestCorners,
	DndContext,
	DragEndEvent,
	DragOverEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import hydrate from "next-mdx-remote/hydrate";
import React from "react";

import type { BannerProps } from "@/pages";

import BannerSection from "./BannerSection";
import H4 from "./H4";

export default function BannerContext({ banners }: BannerProps) {
	// ids have to be states
	const favouriteIds: string[] = [];
	const managerIds: string[] = [];
	const infoIds: string[] = [];
	const sheetIds: string[] = [];
	banners.forEach((banner) => {
		if (banner.data.category === "manager")
			managerIds.push(`${banner.data.category} ${banner.data.url}`);
		if (banner.data.category === "info")
			infoIds.push(`${banner.data.category} ${banner.data.url}`);
		if (banner.data.category === "sheet")
			sheetIds.push(`${banner.data.category} ${banner.data.url}`);
	});

	const hydratedBanners = banners.map((banner) => {
		const content = hydrate(banner.mdxSource, {
			components: { h4: H4 },
		});
		return { ...banner, content };
	});

	const [reactiveBanners, setReactiveBanners] = React.useState(hydratedBanners);

	const sensors = useSensors(
		useSensor(MouseSensor, {
			// Require the mouse to move by 10 pixels before activating
			activationConstraint: {
				distance: 10,
			},
		}),
		useSensor(TouchSensor, {
			// Press delay of 250ms, with tolerance of 5px of movement
			activationConstraint: {
				delay: 250,
				tolerance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	function handleDragStart(event: DragEndEvent) {
		const { active } = event;
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		console.log(event);

		if (active.id !== over?.id) {
			if (
				over?.id.split(" ")[0] === "favourites" &&
				active.id.split(" ")[0] !== "favourites"
			) {
				const remainder = reactiveBanners.filter(
					(b) => b.data.url !== active.id.split(" ")[1],
				);
				const selected = reactiveBanners.filter(
					(b) => b.data.url === active.id.split(" ")[1],
				)[0];
				selected.data.category = "favourites";
				setReactiveBanners([...remainder, selected]);
			} else {
				setReactiveBanners((i) => {
					const oldIndex = i
						.map((e) => `${e.data.category} ${e.data.url}`)
						.indexOf(active.id);
					const newIndex = i
						.map((e) => `${e.data.category} ${e.data.url}`)
						.indexOf(over?.id ?? "asd");

					// also sort ids

					return arrayMove(i, oldIndex, newIndex);
				});
			}
		}
		console.log(managerIds);
	}

	function handleDragOver(event: DragOverEvent) {
		const { active, over } = event;
		console.log(event);
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
		>
			<SortableContext items={favouriteIds} strategy={rectSortingStrategy}>
				<BannerSection
					banners={reactiveBanners}
					category="favourites"
					title="Favourites"
				/>
			</SortableContext>
			<SortableContext items={managerIds} strategy={rectSortingStrategy}>
				<BannerSection
					banners={reactiveBanners}
					category="manager"
					title="Account Managers"
				/>
			</SortableContext>
			<SortableContext items={infoIds} strategy={rectSortingStrategy}>
				<BannerSection
					banners={reactiveBanners}
					category="info"
					title="Informational sites"
				/>
			</SortableContext>
			<SortableContext items={sheetIds} strategy={rectSortingStrategy}>
				<BannerSection
					banners={reactiveBanners}
					category="sheet"
					title="Community spreadsheets"
				/>
			</SortableContext>
		</DndContext>
	);
}
