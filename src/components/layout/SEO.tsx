import Head from "next/head";

export const SITE_URL = "https://destinylauncher.net";
export const SITE_NAME = "Destiny Launcher";
const DEFAULT_TITLE =
	"Destiny Launcher – Destiny 2 Tools & Websites in One Place";
const DEFAULT_DESCRIPTION =
	"Launch DIM, Light.gg, Raid Report and 35+ other Destiny 2 tools from one ad-free page. Item managers, databases, raid stats and community spreadsheets.";

const PUBLISHER_ID = `${SITE_URL}/#publisher`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const siteJsonLd = [
	{
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": WEBSITE_ID,
		url: `${SITE_URL}/`,
		name: SITE_NAME,
		description: DEFAULT_DESCRIPTION,
		inLanguage: "en",
		publisher: { "@id": PUBLISHER_ID },
	},
	{
		"@context": "https://schema.org",
		"@type": "Person",
		"@id": PUBLISHER_ID,
		name: "Andris Borbas",
		url: "https://github.com/AndrisBorbas",
		sameAs: [
			"https://github.com/AndrisBorbas",
			"https://twitter.com/AndrisBorbas",
			"https://ko-fi.com/andrisborbas",
		],
	},
];

const NO_JSON_LD: object[] = [];

export type SEOProps = {
	title?: string;
	description?: string;
	/** Path relative to the site root, e.g. "/" */
	path?: string;
	noindex?: boolean;
	jsonLd?: object[];
};

export function SEO({
	title = DEFAULT_TITLE,
	description = DEFAULT_DESCRIPTION,
	path = "/",
	noindex = false,
	jsonLd = NO_JSON_LD,
}: SEOProps) {
	const url = `${SITE_URL}${path}`;

	return (
		<Head>
			<link rel="preconnect" href="https://vitals.vercel-insights.com" />
			<link rel="preconnect" href="https://succ.andrisborbas.com" />
			<title>{title}</title>
			<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			<meta name="description" content={description} />
			{noindex ? (
				<meta name="robots" content="noindex, follow" />
			) : (
				<link rel="canonical" href={url} />
			)}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={`${SITE_URL}/preview.png`} />
			<meta name="thumbnail" content={`${SITE_URL}/preview.png`} />
			<meta property="og:image" content={`${SITE_URL}/preview.png`} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:url" content={url} />
			<meta property="og:type" content="website" />
			<meta property="og:site_name" content={SITE_NAME} />
			{!noindex && (
				<script
					type="application/ld+json"
					// eslint-disable-next-line react-dom/no-dangerously-set-innerhtml -- escaped JSON-LD
					dangerouslySetInnerHTML={{
						__html: JSON.stringify([...siteJsonLd, ...jsonLd]).replace(
							/</g,
							"\\u003c",
						),
					}}
				/>
			)}
			<link
				rel="apple-touch-icon"
				sizes="60x60"
				href="/apple-touch-icon-60x60.png"
			/>
			<link
				rel="apple-touch-icon"
				sizes="76x76"
				href="/apple-touch-icon-76x76.png"
			/>
			<link
				rel="apple-touch-icon"
				sizes="120x120"
				href="/apple-touch-icon-120x120.png"
			/>
			<link
				rel="apple-touch-icon"
				sizes="152x152"
				href="/apple-touch-icon-152x152.png"
			/>
			<link
				rel="apple-touch-icon"
				sizes="180x180"
				href="/apple-touch-icon-180x180.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="512x512"
				href="/favicon-512x512.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="192x192"
				href="/favicon-192x192.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="32x32"
				href="/favicon-32x32.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="16x16"
				href="/favicon-16x16.png"
			/>
			<link rel="manifest" href="/site.webmanifest" />
			<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#161627" />
			<meta name="apple-mobile-web-app-title" content="Destiny Launcher" />
			<meta name="application-name" content="Destiny Launcher" />
			<meta name="msapplication-TileColor" content="#161627" />
			<meta name="theme-color" content="#161627" />
			<meta name="color-scheme" content="dark light" />

			<meta name="mobile-web-app-capable" content="yes" />
			<meta name="apple-mobile-web-app-capable" content="yes" />
			<meta name="apple-mobile-web-app-status-bar-style" content="default" />
			<meta name="format-detection" content="telephone=no" />
			<link rel="manifest" href="/manifest.json" />

			<link rel="shortcut icon" href="/favicon-100x100.png" />
		</Head>
	);
}
