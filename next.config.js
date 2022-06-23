const withBundleAnalyzer = require("@next/bundle-analyzer");
const withPlugins = require("next-compose-plugins");
const withMDX = require("@next/mdx")({
	extension: /\.mdx?$/,
	options: {
		providerImportSource: "@mdx-js/react",
	},
});
const withPWA = require("next-pwa");
const withTM = require("next-transpile-modules")(["bungie-api-ts"]);

/** @type {import("next").NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ["bungie.net"],
	},
	experimental: {
		newNextLinkBehavior: true,
	},
	swcMinify: true,
};

module.exports = withPlugins(
	[
		[withTM],
		[withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })],
		[
			withMDX,
			{
				pageExtensions: ["tsx", "mdx", "ts"],
			},
		],
		[
			withPWA,
			{
				pwa: {
					dest: "public",
					disable: process.env.NODE_ENV !== "production",
				},
			},
		],
	],
	nextConfig,
);
