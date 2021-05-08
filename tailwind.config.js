const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const aspectRatio = require("@tailwindcss/aspect-ratio");

module.exports = {
	// mode: process.env.NODE_ENV ? "jit" : undefined,
	purge: ["./src/**/*.{js,ts,tsx,scss}"],
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
					DEFAULT: "rgba(183,140,37,.8)",
				},
			},
			fontFamily: {
				NeueHGD: [
					"NeueHaasGroteskDisp",
					"ui-sans-serif",
					"system-ui",
					"-apple-system",
					"Segoe UI",
					"Roboto",
				],
				NeueHGT: [
					"NeueHaasGroteskText",
					"ui-sans-serif",
					"system-ui",
					"-apple-system",
					"Segoe UI",
					"Roboto",
				],
			},
		},
	},
	variants: {
		extend: {
			placeholderOpacity: ["dark"],
			ringWidth: ["focus-visible"],
			transitionProperty: ["motion-reduce"],
		},
	},
	corePlugins: {
		animation: false,
	},
	plugins: [aspectRatio],
};
