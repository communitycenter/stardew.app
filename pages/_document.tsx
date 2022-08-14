import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="description"
            content="Keep track of your Stardew Valley progression."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://stardew.app" />
          <meta property="og:title" content="Stardew.app" />
          <meta
            property="og:description"
            content="Keep track of your Stardew Valley progression."
          />
          <meta property="og:image" content="https://stardew.app/icon.png" />
          <meta property="og:image:width" content="512" />
          <meta property="og:image:height" content="512" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content="https://stardew.app" />
          <meta name="twitter:title" content="Stardew.app" />
          <meta
            name="twitter:description"
            content="Keep track of your Stardew Valley progression."
          />
          <meta name="twitter:image" content="https://stardew.app/icon.png" />
          <meta name="twitter:image:width" content="512" />
          <meta name="twitter:image:height" content="512" />

          <link rel="icon" href="/icon.png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com/" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="bg-[#f7f7f7] dark:bg-[#111111]">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
