import withBundleAnalyzer from "@next/bundle-analyzer";
import withMDX from "@next/mdx";
import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	pageExtensions: ["tsx", "mdx", "ts"],
	images: {
		deviceSizes: [375],
		imageSizes: [40, 48, 64, 390, 520],
		domains: ["bungie.net"],
		unoptimized: true,
	},
	transpilePackages: ["@bungie-api-ts"],
	experimental: {
		reactCompiler: true,
	},

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	webpack(config: any) {
		// Handle SVG imports as React components
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			use: ["@svgr/webpack"],
		});

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return config;
	},

	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},

	// eslint-disable-next-line @typescript-eslint/require-await
	async headers() {
		const headers = [
			{
				source: "/assets/:path*",
				headers: [
					{
						key: "X-Robots-Tag",
						value: "noindex",
					},
				],
			},
		];
		if (process.env.VERCEL_ENV !== "production") {
			headers.push({
				source: "/:path*",
				headers: [
					{
						key: "X-Robots-Tag",
						value: "noindex",
					},
				],
			});
		}
		return headers;
	},
};

const config = withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(
	withMDX({
		extension: /\.mdx?$/,
		options: {
			providerImportSource: "@mdx-js/react",
		},
	})(
		// @ts-expect-error: pwa works
		withPWA({
			dest: "public",
			disable: process.env.NODE_ENV !== "production",
			// @ts-expect-error: pwa works
		})(nextConfig),
	),
);

export default config;
