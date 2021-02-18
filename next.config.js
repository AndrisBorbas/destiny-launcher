const withBundleAnalyzer = require("@next/bundle-analyzer");
const withPlugins = require("next-compose-plugins");
const withMDX = require("@next/mdx")({
	extension: /\.mdx?$/,
});

module.exports = withPlugins(
	[withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })],
	[withMDX({ pageExtensions: ["tsx", "mdx"] })],
	{
		reactStrictMode: true,
	},
);
