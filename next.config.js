const withBundleAnalyzer = require("@next/bundle-analyzer");
const withPlugins = require("next-compose-plugins");
const withMDX = require("@next/mdx")({
	extension: /\.mdx?$/,
});
const withPWA = require("next-pwa");
const withTM = require("next-transpile-modules")(["bungie-api-ts"]);

/** @type {import("next").NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	future: {
		strictPostcssConfiguration: true,
	},
	images: {
		domains: ["bungie.net"],
	},
	swcMinify: true,
	async rewrites() {
		return {
			fallback: [
				{
					source: "/2021",
					destination: "https://konferencia.simonyi.bme.hu",
				},
				{
					source: "/2021/:path*",
					destination: "https://konferencia.simonyi.bme.hu/:path*",
				},
			],
		};
	},
};

module.exports = withPlugins(
	[
		[withTM],
		[withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })],
		[withMDX, { pageExtensions: ["tsx", "mdx", "ts"] }],
		[
			withPWA,
			{
				pwa: {
					dest: "public",
					disable: process.env.NODE_ENV === "development",
					register: false,
				},
			},
		],
	],
	nextConfig,
);
