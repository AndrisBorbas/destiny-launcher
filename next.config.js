const withBundleAnalyzer = require("@next/bundle-analyzer");
const withPlugins = require("next-compose-plugins");
const withMDX = require("@next/mdx")({
	extension: /\.mdx?$/,
});
const withPWA = require("next-pwa");

module.exports = withPlugins(
	[
		[withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })],
		{
			reactStrictMode: true,
		},
		[withMDX({ pageExtensions: ["tsx", "mdx"] })],
		{
			reactStrictMode: true,
		},
		[
			withPWA({
				pwa: {
					dest: "public",
				},
			}),
		],
		{
			reactStrictMode: true,
		},
	],
	{
		reactStrictMode: true,
	},
);
