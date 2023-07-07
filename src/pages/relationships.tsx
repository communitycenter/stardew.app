import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Relationships() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Track and manage your relationships with villagers in Stardew Valley. Keep tabs on the villagers' heart levels, gifts, and interactions to deepen your connections. Monitor your progress towards reaching maximum heart levels and building strong relationships with the community."
        />
        <meta
          name="og:description"
          content="Track and manage your relationships with villagers in Stardew Valley. Keep tabs on the villagers' heart levels, gifts, and interactions to deepen your connections. Monitor your progress towards reaching maximum heart levels and building strong relationships with the community."
        />
        <meta
          name="twitter:description"
          content="Track and manage your relationships with villagers in Stardew Valley. Keep tabs on the villagers' heart levels, gifts, and interactions to deepen your connections. Monitor your progress towards reaching maximum heart levels and building strong relationships with the community."
        />
        <meta
          name="keywords"
          content="stardew valley relationship tracker, stardew valley villager relationships, stardew valley heart levels, stardew valley gifts, stardew valley community, stardew valley friendship, stardew valley gameplay tracker, stardew valley, stardew, relationship tracker"
        />
      </Head>
      <main
        className={`flex min-h-screen items-center justify-center md:border-l border-neutral-200 dark:border-neutral-800 ${inter.className}`}
      >
        <h1 className="text-4xl font-semibold">placeholder</h1>
      </main>
    </>
  );
}
