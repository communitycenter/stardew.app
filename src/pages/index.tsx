import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen items-center justify-center ${inter.className}`}
    >
      <h1 className="text-4xl font-semibold">Hello</h1>
    </main>
  );
}
