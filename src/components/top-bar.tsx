import { presets } from "@/data/presets";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PresetSelector } from "@/components/preset-selector";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export function Topbar() {
  return (
    <div>
      <div className="flex items-center justify-between py-3.5 sm:flex-row sm:items-center sm:space-y-0 md:h-16 px-7">
        <h2 className="text-lg font-semibold">stardew.app</h2>
        {/* Mobile Menu */}
        <div className="md:hidden flex justify-end">
          <Button variant="outline">
            <HamburgerMenuIcon className="h-4 w-4" />
          </Button>
        </div>
        {/* Desktop Version */}
        <div className="hidden ml-auto w-full space-x-2 sm:justify-end md:flex">
          <PresetSelector presets={presets} />
          <Button
            variant="secondary"
            className="hover:bg-green-500 hover:text-neutral-50 dark:hover:bg-green-500 dark:hover:text-neutral-50"
          >
            Upload
          </Button>
          <Button className="dark:hover:bg-[#5865F2] hover:bg-[#5865F2] dark:hover:text-white">
            Log In With Discord
          </Button>
        </div>
      </div>
      <Separator />
    </div>
  );
}
