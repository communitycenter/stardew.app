// every page is gonna need lg:border-l border-neutral-200 dark:border-neutral-800

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen items-center justify-center md:border-l border-neutral-200 dark:border-neutral-800 ${inter.className}`}
    >
      <h1 className="text-4xl font-semibold">Hello</h1>
    </main>
  );
}
