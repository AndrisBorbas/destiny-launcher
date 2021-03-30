import {
	closestCenter,
	DndContext,
	DragEndEvent,
	DragOverlay,
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
import fs from "fs";
import matter from "gray-matter";
import type { InferGetStaticPropsType } from "next";
import hydrate from "next-mdx-remote/hydrate";
import renderToString from "next-mdx-remote/render-to-string";
import { type } from "node:os";
import path from "path";
import React from "react";

import Banner, { BannerPreview } from "@/components/banner/Banner";
import BannerSection from "@/components/banner/BannerSection";
import H4 from "@/components/banner/H4";
import FAQ from "@/components/faq/FAQ";
import Layout from "@/components/Layout";
import { BANNERS_PATH, bannersFilePaths } from "@/utils/mdxUtils";

export const getStaticProps = async () => {
	const banners = await Promise.all(
		bannersFilePaths.map(async (filePath) => {
			const source = fs.readFileSync(path.join(BANNERS_PATH, filePath));
			const { content, data } = matter(source);

			const mdxSource = await renderToString(content, {
				scope: data,
			});

			return {
				mdxSource,
				data,
				filePath,
			};
		}),
	);

	banners.sort((a, b) => {
		let asum = a.data.order;
		if (a.data.category === "manager") asum *= 100;
		if (a.data.category === "info") asum *= 10000;
		if (a.data.category === "sheet") asum *= 1000000;

		let bsum = b.data.order;
		if (b.data.category === "manager") bsum *= 100;
		if (b.data.category === "info") bsum *= 10000;
		if (b.data.category === "sheet") bsum *= 1000000;
		return asum > bsum ? 1 : -1;
	});

	return { props: { banners } };
};

export type BannerProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function Index({ banners }: BannerProps) {
	const ids: string[] = banners.map(
		(banner) => `${banner.data.category} ${banner.data.url}`,
	);
	ids.push("favourites placeholder");

	const hydratedBanners = banners.map((banner) => {
		const content = hydrate(banner.mdxSource, {
			components: { h4: H4 },
		});
		return { ...banner, content };
	});

	const [reactiveBanners, setReactiveBanners] = React.useState(hydratedBanners);

	const sensors = useSensors(
		useSensor(PointerSensor),
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

					return arrayMove(i, oldIndex, newIndex);
				});
			}
		}
	}

	return (
		<Layout className="safe-area-x flex flex-col mb-8 mx-auto sm:px-4 md:px-8 lg:px-12 xl:px-16">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<SortableContext items={ids} strategy={rectSortingStrategy}>
					<BannerSection
						banners={reactiveBanners}
						category="favourites"
						title="Favourites"
					/>
					<BannerSection
						banners={reactiveBanners}
						category="manager"
						title="Account Managers"
					/>
					<BannerSection
						banners={reactiveBanners}
						category="info"
						title="Informational sites"
					/>
					<BannerSection
						banners={reactiveBanners}
						category="sheet"
						title="Community spreadsheets"
					/>
				</SortableContext>
			</DndContext>
			<FAQ />
		</Layout>
	);
}
