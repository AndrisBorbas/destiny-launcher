import fs from "fs";
import path from "path";

// BANNERS_PATH is useful when you want to get the path to a specific file
export const BANNERS_PATH = path.join(process.cwd(), "src/data/banners");

// bannersFilePaths is the list of all mdx files inside the BANNERS_PATH directory
export const bannersFilePaths = fs
	.readdirSync(BANNERS_PATH)
	// Only include md(x) files
	.filter((p) => /\.mdx?$/.test(p));
