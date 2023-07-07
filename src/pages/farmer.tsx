import { InfoCard } from "@/components/cards/infocard";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Farmer() {
  return (
    <main
      className={`flex min-h-screen items-left md:border-l border-neutral-200 dark:border-neutral-800 ${inter.className} p-8`}
    >
      <div className="flex flex-col items-left justify-left">
        <div className="grid grid-cols-1 gap-4 py-4">
          <div>
            <div className="mb-2 mt-4 ml-1 text-2xl font-semibold text-gray-900 dark:text-white md:text-xl">
              Farmer Information
            </div>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
              <InfoCard title="Farmer" description="my name jeff" />
              <InfoCard title="Farmer" description="my name jeff" />
              <InfoCard title="Farmer" description="my name jeff" />
              <InfoCard title="Farmer" description="my name jeff" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
