import {
	defaultDropAnimation,
	DndContext,
	DragOverlay,
	DropAnimation,
	KeyboardSensor,
	MouseSensor,
	rectIntersection,
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
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import type { HydratedBannerType } from "@/@types/DataTypes";
import type { BannerProps } from "@/pages";

import DroppableContainer from "../dnd/DroppableContainer";
import Banner from "./Banner";
import styles from "./BannerSection.module.scss";
import H4 from "./H4";

const TITLES: { [key in string]: string } = {
	favourite: "Favourites",
	manager: "Account Managers",
	info: "Informational sites",
	sheet: "Community spreadsheets",
};

const dropAnimation: DropAnimation = {
	...defaultDropAnimation,
	dragSourceOpacity: 0.5,
};

const VOID_ID = "__void__";

type Keys = "favourite" | "manager" | "info" | "sheet";

type Banners = {
	[key in Keys]: HydratedBannerType[];
};

type BannersStorage = {
	[key in Keys]: string[];
};

export default function BannerSection({ banners: rawBanners }: BannerProps) {
	const hydratedBanners = rawBanners.map((banner) => {
		const content = hydrate(banner.content, {
			components: { h4: H4 },
		});
		return { ...banner, content };
	});

	const [banners, setBanners] = useState(() => {
		const favourite = hydratedBanners.filter(
			(banner) => banner.data.category === "favourite",
		);
		const manager = hydratedBanners.filter(
			(banner) => banner.data.category === "manager",
		);
		const info = hydratedBanners.filter(
			(banner) => banner.data.category === "info",
		);
		const sheet = hydratedBanners.filter(
			(banner) => banner.data.category === "sheet",
		);
		return {
			favourite,
			manager,
			info,
			sheet,
		};
	});

	useEffect(() => {
		const jsonString = localStorage.getItem("order");
		if (!jsonString) return () => {};
		const storage: BannersStorage = JSON.parse(jsonString);
		setBanners((items) => {
			const flat = Object.values(items).flat(1);
			const modified: Banners = {
				favourite: [],
				manager: [],
				info: [],
				sheet: [],
			};

			Object.keys(storage).forEach((containerId) => {
				modified[containerId as Keys] = storage[containerId as Keys].map(
					(id) => {
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						return flat.find((banner) => banner.id === id)!;
					},
				);
			});

			const tempFlat = Object.values(modified).flat(1);

			Object.keys(storage).forEach((containerId) => {
				items[containerId as Keys].forEach((banner) => {
					if (
						tempFlat.every((item) => item.id !== banner.id) &&
						containerId === banner.data.category
					) {
						console.log(containerId, banner);
						modified[containerId as Keys].push(banner);
					}
				});
			});

			return modified;
		});
		return () => {};
	}, []);

	function saveState(state: Banners) {
		const jsonString = localStorage.getItem("order");
		const storage: BannersStorage =
			jsonString != null
				? JSON.parse(jsonString)
				: { favourite: [], manager: [], info: [], sheet: [] };

		Object.keys(state).forEach((containerId) => {
			storage[containerId as Keys] = state[containerId as Keys].map(
				(banner) => {
					return banner.id;
				},
			);
		});

		localStorage.setItem("order", JSON.stringify(storage));
	}

	const [clonedItems, setClonedItems] = useState<Banners | null>(null);
	const [activeId, setActiveId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const findContainer = (id: string) => {
		if (id in banners) {
			return id as Keys;
		}

		return Object.keys(banners).find((key) =>
			banners[key as Keys].some((banner) => banner.id === id),
		) as Keys;
	};

	const getIndex = (id: string) => {
		const container = findContainer(id);

		if (!container) {
			return -1;
		}

		const index = banners[container as Keys].findIndex(
			(banner) => banner.id === id,
		);

		return index;
	};

	const onDragCancel = () => {
		if (clonedItems) {
			// Reset items to their original state in case items have been
			// Dragged across containrs
			saveState(clonedItems);
			setBanners(clonedItems);
		}

		setActiveId(null);
		setClonedItems(null);
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={rectIntersection}
			onDragStart={(event) => {
				const { active } = event;
				setActiveId(active.id);
				setClonedItems(banners);
			}}
			onDragOver={(event) => {
				const { active, over } = event;
				const overId = over?.id;

				if (!overId) {
					return;
				}

				const overContainer = findContainer(overId);
				const activeContainer = findContainer(active.id);

				if (!overContainer || !activeContainer) {
					return;
				}

				if (activeContainer !== overContainer) {
					setBanners((items) => {
						const activeItems = items[activeContainer];

						const overItems = items[overContainer];
						const overIndex = overItems.findIndex(
							(banner) => banner.id === overId,
						);
						const activeIndex = activeItems.findIndex(
							(banner) => banner.id === active.id,
						);

						let newIndex: number;

						if (overId in items) {
							newIndex = overItems.length + 1;
						} else {
							const isBelowLastItem =
								over &&
								overIndex === overItems.length - 1 &&
								active.rect.current.translated &&
								active.rect.current.translated.offsetTop >
									over.rect.offsetTop + over.rect.height;

							const modifier = isBelowLastItem ? 1 : 0;

							newIndex =
								overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
						}

						const modified = {
							...items,
							[activeContainer]: [
								...items[activeContainer].filter(
									(item) => item.id !== active.id,
								),
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
						Object.keys(modified).forEach((containerId) => {
							modified[containerId as Keys].forEach((banner, i) => {
								// eslint-disable-next-line no-param-reassign
								banner.index = i;
							});
						});

						saveState(modified);
						return modified;
					});
				}
			}}
			onDragEnd={(event) => {
				const { active, over } = event;
				const activeContainer = findContainer(active.id);

				if (!activeContainer) {
					setActiveId(null);
					return;
				}

				const overId = over?.id || VOID_ID;
				/*
				if (overId === VOID_ID) {
					// @ts-expect-error: keys should be the same
					setBanners((items) => ({
						...(false && over?.id === VOID_ID ? items : clonedItems),
						[VOID_ID]: [],
					}));
					setActiveId(null);
					return;
				}
				*/
				const overContainer = findContainer(overId);

				if (activeContainer && overContainer) {
					const activeIndex = banners[activeContainer].findIndex(
						(banner) => banner.id === active.id,
					);

					const overIndex = banners[overContainer].findIndex(
						(banner) => banner.id === overId,
					);

					if (activeIndex !== overIndex) {
						setBanners((items) => {
							const modified = {
								...items,
								[overContainer]: arrayMove(
									items[overContainer],
									activeIndex,
									overIndex,
								),
							};
							Object.keys(modified).forEach((containerId) => {
								modified[containerId as Keys].forEach((banner, i) => {
									// eslint-disable-next-line no-param-reassign
									banner.index = i;
								});
							});

							saveState(modified);
							return modified;
						});
					}
				}

				setActiveId(null);
			}}
			onDragCancel={onDragCancel}
		>
			{Object.keys(banners).map((containerId) => {
				return (
					<SortableContext
						key={containerId}
						items={banners[containerId as Keys]}
						strategy={rectSortingStrategy}
					>
						<h2 className={styles.headerText} id={containerId}>
							{TITLES[containerId as Keys]}
						</h2>

						<DroppableContainer
							id={containerId}
							// items={banners[containerId as Keys].map((banner) => banner.id)}
							className={styles.bannerSection}
						>
							{banners[containerId as Keys].map((banner) => {
								return (
									<Banner
										key={banner.id}
										id={banner.id}
										isActive={activeId === banner.id}
										{...banner.data}
									>
										{banner.content}
									</Banner>
								);
							})}
							{containerId === "favourite" &&
								banners[containerId as Keys].length === 0 && (
									<article
										className="bg-blur-10 flex items-center justify-center w-full text-center text-lg border-t border-gray-500"
										style={{ height: "72px" }}
									>
										Drag & drop banners here to add them to favourites.
									</article>
								)}
						</DroppableContainer>
					</SortableContext>
				);
			})}
			{/* typeof window !== "undefined" &&
				createPortal(
					<DragOverlay dropAnimation={dropAnimation}>
						{activeId ? (
							<Banner
								id="asd"
								{...banners[findContainer(activeId)!].find(
									(item) => item.id === activeId,
								)!.data}
							>
								asd
							</Banner>
						) : null}
					</DragOverlay>,
					document.body,
								) */}
		</DndContext>
	);
}
