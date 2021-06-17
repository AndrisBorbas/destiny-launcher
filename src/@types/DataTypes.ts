import type { MDXRemoteSerializeResult } from "next-mdx-remote";

export type BannerDataTypes = {
	category: string;
	headerText: string;
	url: string;
	loggedInURL?: string;
	iconSrc: string;
	previewImage: string;
	order: number;
};

export type HydratedBannerType = {
	id: string;
	index: number;
	data: BannerDataTypes;
	content: MDXRemoteSerializeResult;
};
