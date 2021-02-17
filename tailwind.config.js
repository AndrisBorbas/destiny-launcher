const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
	purge: ["./src/**/*.{js,ts,tsx}"],
	theme: {
		colors,
		extend: {
			transitionTimingFunction: {
				DEFAULT: defaultTheme.transitionTimingFunction.out,
			},
			fontFamily: {
				Roboto: "Roboto",
				Montserrat: "Montserrat",
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
	plugins: [],
};
