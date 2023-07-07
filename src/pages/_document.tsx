import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="Stardew.app is a web application that allows you to track your Stardew Valley progress by uploading your save file. Gain valuable insights into your progress, monitor achievements, and optimize your gameplay. Take control of your farm, relationships, and community events, and uncover hidden secrets. Maximize your efficiency and become the ultimate Stardew Valley perfectionist. Start tracking your save files today!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stardew.app" />
        <meta property="og:title" content="Stardew.app" />
        <meta
          property="og:description"
          content="Keep track of your Stardew Valley progression."
        />

        {/* Add a new logo eventually */}
        {/* <meta property="og:thumbnail" content="https://stardew.app/icon.png" />
        <meta property="og:image:width" content="64" />
        <meta property="og:image:height" content="64" /> */}

        <meta name="twitter:card" content="summary" />
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
      </Head>
      <body className="dark:bg-neutral-950 overscroll-y-none">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
