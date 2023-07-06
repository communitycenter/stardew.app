import { presets } from "@/data/presets";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PresetSelector } from "@/components/preset-selector";

export function Topbar() {
  return (
    <div>
      <div className="flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16 px-7">
        <h2 className="text-lg font-semibold">stardew.app</h2>
        <div className="ml-auto flex w-full space-x-2 sm:justify-end">
          <PresetSelector presets={presets} />
          <Button variant="secondary">Upload</Button>
          <Button>Log In With Discord</Button>
        </div>
      </div>
      <Separator />
    </div>
  );
}
