import {
	closestCorners,
	defaultDropAnimation,
	DndContext,
	DragOverlay,
	DropAnimation,
	KeyboardSensor,
	PointerSensor,
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
import type { MdxRemote } from "next-mdx-remote/types";
import React, { useState } from "react";
import { createPortal } from "react-dom";

import type { BannerProps } from "@/pages";

import DroppableContainer from "../dnd/DroppableContainer";
import Banner from "./Banner";
import styles from "./BannerSection.module.scss";
import H4 from "./H4";

const TITLES: { [key in string]: string } = {
	favourites: "Favourites",
	manager: "Account Managers",
	info: "Informational sites",
	sheet: "Community spreadsheets",
};

const dropAnimation: DropAnimation = {
	...defaultDropAnimation,
	dragSourceOpacity: 0.5,
};

type IDs = {
	[key in string]: string[];
};

export type ReactiveBanner = {
	content: React.ReactNode;
	mdxSource: MdxRemote.Source;
	data: {
		[key: string]: any;
	};
	filePath: string;
};

type Banners = {
	[key in string]: ReactiveBanner[];
};

export default function BannerSection({ banners }: BannerProps) {
	function mapBanners(category: string) {
		return banners
			.filter((banner) => banner.data.category === category)
			.map((banner) => banner.data.id);
	}

	const [ids, setIds] = useState<IDs>({
		favourites: [],
		manager: mapBanners("manager"),
		info: mapBanners("info"),
		sheet: mapBanners("sheet"),
	});
	const [activeId, setActiveId] = useState<string | null>(null);
	const [clonedIds, setClonedIds] = useState<IDs | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const hydratedBanners = banners.map((banner) => {
		const content = hydrate(banner.mdxSource, {
			components: { h4: H4 },
		});
		return { ...banner, content };
	});

	function filterBanners(category: string) {
		return hydratedBanners.filter(
			(banner) => banner.data.category === category,
		);
	}

	const [reactiveBanners, setReactiveBanners] = useState<Banners>({
		favourites: [],
		manager: filterBanners("manager"),
		info: filterBanners("info"),
		sheet: filterBanners("sheet"),
	});

	const findContainer = (id: string) => {
		if (id in ids) {
			return id;
		}

		return Object.keys(ids).find((key) => ids[key].includes(id));
	};

	const getIndex = (id: string) => {
		const container = findContainer(id);

		if (!container) {
			return -1;
		}

		const index = ids[container].indexOf(id);

		return index;
	};

	const onDragCancel = () => {
		if (clonedIds) {
			// Reset items to their original state in case items have been
			// Dragged across containrs
			setIds(clonedIds);
		}

		setActiveId(null);
		setClonedIds(null);
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={({ active }) => {
				setActiveId(active.id);
				setClonedIds(ids);
			}}
			onDragOver={(event) => {
				const { active, over, draggingRect } = event;
				const overId = over?.id;

				console.log(event);

				if (!overId) {
					return;
				}

				const overContainer = findContainer(overId);
				const activeContainer = findContainer(active.id);

				if (!overContainer || !activeContainer) {
					return;
				}

				if (activeContainer !== overContainer) {
					setIds((items) => {
						const activeItems = items[activeContainer];
						const overItems = items[overContainer];
						const overIndex = overItems.indexOf(overId);
						const activeIndex = activeItems.indexOf(active.id);

						let newIndex: number;

						if (overId in items) {
							newIndex = overItems.length + 1;
						} else {
							const isBelowLastItem =
								over &&
								overIndex === overItems.length - 1 &&
								draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

							const modifier = isBelowLastItem ? 1 : 0;

							newIndex =
								overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
						}

						return {
							...items,
							[activeContainer]: [
								...items[activeContainer].filter((item) => item !== active.id),
							],
							[overContainer]: [
								...items[overContainer].slice(0, newIndex),
								items[activeContainer][activeIndex],
								...items[overContainer].slice(
									newIndex,
									items[overContainer].length,
								),
							],
						};
					});

					setReactiveBanners((items) => {
						const activeItems = items[activeContainer];
						const overItems = items[overContainer];
						const overIndex = overItems.findIndex(
							(item) => item.data.id === overId,
						);
						const activeIndex = activeItems.findIndex(
							(item) => item.data.id === active.id,
						);

						let newIndex: number;

						if (overId in items) {
							newIndex = overItems.length + 1;
						} else {
							const isBelowLastItem =
								over &&
								overIndex === overItems.length - 1 &&
								draggingRect.offsetTop > over.rect.offsetTop + over.rect.height;

							const modifier = isBelowLastItem ? 1 : 0;

							newIndex =
								overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
						}

						return {
							...items,
							[activeContainer]: [
								...items[activeContainer].filter(
									(item) => item.data.id !== active.id,
								),
							],
							[overContainer]: [
								...items[overContainer].slice(0, newIndex),
								items[activeContainer].filter(
									(item) => item.data.id === active.id,
								)[0],
								...items[overContainer].slice(
									newIndex,
									items[overContainer].length,
								),
							],
						};
					});
				}
			}}
			onDragEnd={({ active, over }) => {
				const activeContainer = findContainer(active.id);

				if (!activeContainer) {
					setActiveId(null);
					return;
				}

				const overId = over?.id || "void";

				const overContainer = findContainer(overId);

				if (activeContainer && overContainer) {
					const activeIndex = ids[activeContainer].indexOf(active.id);
					const overIndex = ids[overContainer].indexOf(overId);

					if (activeIndex !== overIndex) {
						setIds((items) => ({
							...items,
							[overContainer]: arrayMove(
								items[overContainer],
								activeIndex,
								overIndex,
							),
						}));
						setReactiveBanners((items) => {
							const oldIndex = items[overContainer]
								.map((e) => e.data.id)
								.indexOf(active.id);
							const newIndex = items[overContainer]
								.map((e) => e.data.id)
								.indexOf(over?.id ?? "asd");

							return {
								...items,
								[overContainer]: arrayMove(
									items[overContainer],
									oldIndex,
									newIndex,
								),
							};
						});
					}
				}

				setActiveId(null);
			}}
			onDragCancel={onDragCancel}
		>
			{Object.keys(ids).map((containerId) => (
				<SortableContext
					key={containerId}
					items={ids[containerId]}
					strategy={rectSortingStrategy}
				>
					<h2 className={styles.headerText}>{TITLES[containerId]}</h2>
					<DroppableContainer id={containerId} className={styles.bannerSection}>
						{reactiveBanners[containerId].map((banner) => {
							if (banner.data.category !== containerId) return null;
							return (
								// @ts-expect-error: Banners props should always be the same as the data in the mdx's.
								<Banner key={banner.filePath} {...banner.data}>
									{banner.content}
								</Banner>
							);
						})}
					</DroppableContainer>
				</SortableContext>
			))}
			{/*
			{typeof window !== "undefined" &&
				createPortal(
					<DragOverlay dropAnimation={dropAnimation}>
						{activeId ? (
							<Banner
								{...reactiveBanners[findContainer(activeId)!].find(
									(item) => item.data.id === activeId,
								)?.data}
							>
								asd
							</Banner>
						) : null}
					</DragOverlay>,
					document.body,
				)}
				 */}
		</DndContext>
	);
}
