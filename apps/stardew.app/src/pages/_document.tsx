import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<script
					async
					src="https://analytics.eu.umami.is/script.js"
					data-website-id="148c90ab-aacc-40b4-b1c7-b4eee4862a7c"
				></script>
				<script
					defer
					data-domain="stardew.app"
					src="https://plausible.verbose.faith/js/script.js"
				></script>

				<meta charSet="utf-8" />
				<meta
					name="description"
					content="Keep track of your Stardew Valley 1.5 and 1.6 progression. Upload your save file and track your progress towards 100% completion."
				/>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://stardew.app" />
				<meta property="og:title" content="Stardew.app" />
				<meta
					property="og:description"
					content="Keep track of your Stardew Valley 1.5 and 1.6 progression. Upload your save file and track your progress towards 100% completion."
				/>

				<meta property="og:thumbnail" content="/favicon.png" />
				<meta property="og:image:width" content="64" />
				<meta property="og:image:height" content="64" />

				<meta name="twitter:card" content="summary" />
				<meta name="twitter:url" content="https://stardew.app" />
				<meta name="twitter:title" content="stardew.app" />
				<meta
					name="twitter:description"
					content="Keep track of your Stardew Valley 1.5 and 1.6 progression. Upload your save file and track your progress towards 100% completion."
				/>
				<meta name="twitter:image" content="/favicon.png" />
				<meta name="twitter:image:width" content="512" />
				<meta name="twitter:image:height" content="512" />

				<link rel="icon" href="/favicon.png" />
			</Head>
			<body className="overscroll-y-none dark:bg-neutral-950">
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
