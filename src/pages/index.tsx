import Image from "next/image";
import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import { presets } from "@/data/presets";
import { PresetSelector } from "@/components/preset-selector";
import { Separator } from "@radix-ui/react-separator";

const inter = Inter({ subsets: ["latin"] });
// i cant get the separator to work idunno
export default function Home() {
  return (
    <main className={`${inter.className}`}>
      <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16 ">
        <h2 className="text-lg font-semibold">stardew.app</h2>
        <div className="ml-auto flex w-full space-x-2 sm:justify-end">
          <PresetSelector presets={presets} />
          <Button variant="secondary">Upload</Button>
          <Button>Log In With Discord</Button>
        </div>
      </div>
      <Separator className="my-4" />
    </main>
  );
}
