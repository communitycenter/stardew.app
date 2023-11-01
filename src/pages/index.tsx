import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { parseSaveFile } from "@/lib/file";
import { ChangeEvent, useContext, useRef } from "react";

import { PlayersContext } from "@/contexts/players-context";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const { toast } = useToast();

  const { uploadPlayers } = useContext(PlayersContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target!.files![0];

    if (typeof file === "undefined" || !file) return;

    if (file.type !== "") {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a Stardew Valley save file.",
      });
      return;
    }

    const reader = new FileReader();

    reader.onloadstart = () => {
      toast({
        variant: "default",
        title: "Uploading Save File",
        description: "Please wait while we upload your save file.",
      });
    };

    reader.onload = async function (event) {
      try {
        const players = parseSaveFile(event.target?.result as string);
        await uploadPlayers(players);
        toast({
          variant: "default",
          title: "Save File Uploaded",
          description: "Your save file has been successfully uploaded.",
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error Parsing File",
          description: err instanceof Error ? err.message : "Unknown error.",
        });
      }
    };
    reader.readAsText(file);
  };
  return (
    <>
      <Head>
        <title>stardew.app | Stardew Valley 100% completion tracker</title>
        <meta
          name="description"
          content="The homepage for stardew.app. Upload your Stardew Valley Save File to track your progress towards 100% completion. Login to track your perfection progress across multiple devices."
        />
        <meta
          name="keywords"
          content="stardew valley tracker, stardew tracker, stardew valley perfection tracker, stardew perfection tracker, stardew completion tracker, stardew valley collection tracker, stardew progress checker, stardew valley checklist app, stardew valley tracker app, stardew valley app, stardew app, perfection tracker stardew, stardew checker, stardew valley checker, stardew valley completion tracker, tracker stardew valley, stardew valley save checker, stardew valley companion app, stardew valley progress tracker, stardew valley checklist app, stardew valley, stardew valley tracker app, stardew valley app"
        />
      </Head>
      <main
        className={`flex min-h-[calc(100vh-65px)] md:border-l border-neutral-200 dark:border-neutral-800 pt-2 pb-8 px-5 md:px-8 items-center`}
      >
        <div className="mx-auto max-w-2xl space-y-4 mt-4">
          <Image
            src="/favicon.png"
            alt="stardew.app logo"
            width={56}
            height={56}
            className="mx-auto"
          />
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-950 dark:text-white text-left sm:text-center">
            stardew.app
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base text-left sm:text-center">
            Your ultimate sidekick for conquering Stardew Valley. Seamlessly
            upload your save files and let us do the heavy lifting, or take the
            reins and manually update your progress. Join us in embracing the
            thrills of growth, the joys of harvest, and the satisfaction of
            inching closer to that coveted 100% completion in the heartwarming
            world of Stardew Valley.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              className="w-full"
              asChild
              data-umami-event="Create a farmhand"
            >
              <Link href="/editor/create">Create a Farmhand</Link>
            </Button>
            <Button
              className="w-full"
              data-umami-event="Upload save"
              onClick={() => {
                inputRef.current?.click();
              }}
            >
              Upload Save
              <input
                type="file"
                ref={inputRef}
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
              />
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
