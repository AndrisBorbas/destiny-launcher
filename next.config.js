const withBundleAnalyzer = require("@next/bundle-analyzer");
const withPlugins = require("next-compose-plugins");
const withMDX = require("@next/mdx")({
	extension: /\.mdx?$/,
});
const withPWA = require("next-pwa");

const nextConfig = {
	reactStrictMode: true,
};

module.exports = withPlugins(
	[
		[withBundleAnalyzer, { enabled: process.env.ANALYZE === "true" }],
		[withMDX, { pageExtensions: ["tsx", "mdx"] }],
		[withPWA, { pwa: { dest: "public" } }],
	],
	nextConfig,
);
