import Head from "next/head";
import Image from "next/image";

import { parseSaveFile } from "@/lib/file";
import { ChangeEvent, useContext, useRef } from "react";

import { PlayersContext } from "@/contexts/players-context";

import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

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
        className={`flex min-h-[calc(100vh-65px)]  flex-col md:border-l border-neutral-200 dark:border-neutral-800 pt-2 pb-8 px-5 md:px-8 items-center`}
      >
        <main className="flex flex-col items-center justify-center flex-grow">
          <Image
            src="/favicon.png"
            alt="Log in with Discord"
            className="rounded-sm"
            width={64}
            height={64}
          />
          <h2 className="text-3xl font-semibold text-center">stardew.app</h2>
          <h3 className="text-lg font-normal text-center">
            Your ultimate sidekick for conquering Stardew Valley. Seamlessly
            upload your save files and let us do the heavy lifting, or take the
            reins and manually update your progress. Join us in embracing the
            thrills of growth, the joys of harvest, and the satisfaction of
            inching closer to that coveted 100% completion in the heartwarming
            world of Stardew Valley.
          </h3>
        </main>
        <footer className="p-2 w-full">
          <div className="grid lg:grid-cols-2 gap-4 grid-cols-1">
            <Link href="/api/oauth" data-umami-event="Log in (from home page)">
              <div className="flex select-none items-center space-x-3 rounded-lg border py-4 px-5  text-neutral-950 dark:text-neutral-50 shadow-sm transition-colors border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-blue-600 hover:border-blue-600 hover:cursor-pointer">
                <Image
                  src="/discord.png"
                  alt="Log in with Discord"
                  className="rounded-sm"
                  width={48}
                  height={48}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">Log in with Discord</p>
                  <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                    Link your Discord account to save your data across devices.
                  </p>
                </div>
              </div>
            </Link>

            <div
              className="flex select-none items-center space-x-3 rounded-lg border py-4 px-5  text-neutral-950 dark:text-neutral-50 shadow-sm transition-colors border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-blue-600 hover:border-blue-600 hover:cursor-pointer"
              onClick={() => {
                inputRef.current?.click();
              }}
            >
              <Image
                src="/upload.png"
                alt="Upload a save file"
                className="rounded-sm"
                width={48}
                height={48}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">Upload a save file</p>
                <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                  Upload your save file to track your progress towards
                  perfection.
                </p>
              </div>
              <input
                type="file"
                ref={inputRef}
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
              />
            </div>
            <Link
              href="/editor/create"
              data-umami-event="Create farmhand (from home page)"
            >
              <div className="flex select-none items-center space-x-3 rounded-lg border py-4 px-5  text-neutral-950 dark:text-neutral-50 shadow-sm transition-colors border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-blue-600 hover:border-blue-600 hover:cursor-pointer">
                <Image
                  src="/create.png"
                  alt="Create a farmhand"
                  className="rounded-sm"
                  width={48}
                  height={48}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">Create a farmhand</p>
                  <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                    Create a farmhand to track your progress towards perfection.
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/github" data-umami-event="GitHub (from home page)">
              <div className="flex select-none items-center space-x-3 rounded-lg border py-4 px-5  text-neutral-950 dark:text-neutral-50 shadow-sm transition-colors border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-blue-600 hover:border-blue-600 hover:cursor-pointer">
                <Image
                  src="/github.png"
                  alt="Look at GitHub"
                  className="rounded-sm"
                  width={48}
                  height={48}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">View on GitHub</p>
                  <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                    View the source code for this website on GitHub.
                  </p>
                </div>
              </div>
            </Link>
          </div>
          {/* <p className="text-gray-400 text-xs text-center mt-4">
            ChatGPT can make mistakes. Consider checking important information.
          </p> */}
        </footer>
      </main>
    </>
  );
}
