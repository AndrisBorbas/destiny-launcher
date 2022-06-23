const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const aspectRatio = require("@tailwindcss/aspect-ratio");

/** @type {import("tailwindcss").Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,tsx,scss,mdx}"],
	theme: {
		colors,
		extend: {
			transitionTimingFunction: {
				DEFAULT: defaultTheme.transitionTimingFunction.out,
			},
			colors: {
				banner: {
					DEFAULT: "#1b1f44",
					dark: "#12142b",
				},
				button: {
					DEFAULT: "#ffb80e",
				},
			},
			fontFamily: {
				NeueHGD: [
					"NeueHaasGroteskDisp",
					"ui-sans-serif",
					"system-ui",
					"-apple-system",
					'"Segoe UI"',
					"Roboto",
				],
				NeueHGT: [
					"NeueHaasGroteskText",
					"ui-sans-serif",
					"system-ui",
					"-apple-system",
					'"Segoe UI"',
					"Roboto",
				],
			},
		},
	},
	plugins: [aspectRatio],
};
