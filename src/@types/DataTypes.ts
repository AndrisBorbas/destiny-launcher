export type BannerDataTypes = {
	category: string;
	headerText: string;
	url: string;
	iconSrc: string;
	previewImage: string;
	order: number;
};

export type HydratedBannerType = {
	id: string;
	index: number;
	data: BannerDataTypes;
	content: React.ReactNode;
};
