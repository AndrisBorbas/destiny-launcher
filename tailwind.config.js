const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const aspectRatio = require("@tailwindcss/aspect-ratio");

module.exports = {
	purge: ["./src/**/*.{js,ts,tsx}"],
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
				Roboto: "Roboto",
				Montserrat: "Montserrat",
				NeueHGD: "NeueHaasGroteskDisp",
				NeueHGT: "NeueHaasGroteskText",
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
