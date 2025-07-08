import Head from "next/head";
import Image from "next/image";

import { parseSaveFile } from "@/lib/file";
import { ChangeEvent, useRef, useState } from "react";

import { toast } from "sonner";

import { usePlayers } from "@/contexts/players-context";

import { LoginDialog } from "@/components/dialogs/login-dialog";
import Link from "next/link";

export default function Home() {
	const { uploadPlayers } = usePlayers();
	const [loginOpen, setLoginOpen] = useState(false);

	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();

		const file = e.target!.files![0];

		if (typeof file === "undefined" || !file) return;

		if (file.type !== "") {
			toast.error("Invalid File Type", {
				description: "Please upload a Stardew Valley save file.",
			});
			return;
		}

		const reader = new FileReader();

		reader.onloadstart = () => {
			toast.loading("Uploading Save File", {
				description: "Please wait while we upload your save file.",
			});
		};

		reader.onload = async function (event) {
			try {
				const players = parseSaveFile(event.target?.result as string);
				await uploadPlayers(players);
				toast.success("Uploaded Save File", {
					description: "Your save file has been uploaded successfully",
				});
			} catch (err) {
				toast.error("Error Parsing File", {
					description: err instanceof Error ? err.message : "Unknown error.",
				});
			}
		};
		reader.readAsText(file);
	};

	return (
		<>
			<Head>
				<title>stardew.app | Stardew Valley 100% completion</title>
				<meta
					name="description"
					content="Upload your Stardew Valley save file to track your progress towards 100% completion. Supports the new 1.6 update!"
				/>
				<meta
					name="keywords"
					content="stardew valley tracker, stardew tracker, stardew valley perfection tracker, stardew perfection tracker, stardew completion tracker, stardew valley collection tracker, stardew progress checker, stardew valley checklist app, stardew valley tracker app, stardew valley app, stardew app, perfection tracker stardew, stardew checker, stardew valley checker, stardew valley completion tracker, tracker stardew valley, stardew valley save checker, stardew valley companion app, stardew valley progress tracker, stardew valley checklist app, stardew valley, stardew valley tracker app, stardew valley app"
				/>
			</Head>
			<main
				className={`flex min-h-[calc(100vh-65px)]  flex-col items-center border-neutral-200 px-5 pb-8 pt-2 dark:border-neutral-800 md:border-l md:px-8`}
			>
				<main className="flex max-w-2xl flex-grow flex-col items-center justify-center">
					<div className="mb-4 flex items-center gap-2">
						<Image
							src="/favicon.png"
							alt="stardew.app logo"
							className="rounded-sm"
							width={64}
							height={64}
						/>
						<h2 className="text-center text-3xl font-semibold">stardew.app</h2>
					</div>
					<h3 className="text-center text-lg font-normal">
						Your ultimate sidekick for conquering Stardew Valley. Seamlessly
						upload your save files and let us do the heavy lifting, or take the
						reins and manually update your progress. Join us in embracing the
						thrills of growth, the joys of harvest, and the satisfaction of
						inching closer to that coveted 100% completion in the heartwarming
						world of Stardew Valley.
					</h3>
				</main>
				<footer className="w-full p-2">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<div
							onClick={() => {
								setLoginOpen(true);
							}}
							className="flex select-none items-center space-x-3 rounded-lg border border-neutral-200 bg-white  px-5 py-4 text-neutral-950 shadow-sm transition-colors hover:cursor-pointer hover:border-blue-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:border-blue-600"
						>
							<Image
								src="/discord.png"
								alt="Log in with Discord"
								className="rounded-sm"
								width={48}
								height={48}
							/>
							<div className="min-w-0 flex-1">
								<p className="truncate font-medium">Log in with Discord</p>
								<p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
									Link your Discord account to save your data across devices.
								</p>
							</div>
						</div>

						<div
							className="flex select-none items-center space-x-3 rounded-lg border border-neutral-200 bg-white  px-5 py-4 text-neutral-950 shadow-sm transition-colors hover:cursor-pointer hover:border-blue-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:border-blue-600"
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
								<p className="truncate font-medium">Upload a save file</p>
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
							<div className="flex select-none items-center space-x-3 rounded-lg border border-neutral-200 bg-white  px-5 py-4 text-neutral-950 shadow-sm transition-colors hover:cursor-pointer hover:border-blue-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:border-blue-600">
								<Image
									src="/create.png"
									alt="Create a farmhand"
									className="rounded-sm"
									width={48}
									height={48}
								/>
								<div className="min-w-0 flex-1">
									<p className="truncate font-medium">Create a farmhand</p>
									<p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
										Create a farmhand to track your progress towards perfection.
									</p>
								</div>
							</div>
						</Link>

						<Link href="/github" data-umami-event="GitHub (from home page)">
							<div className="flex select-none items-center space-x-3 rounded-lg border border-neutral-200 bg-white  px-5 py-4 text-neutral-950 shadow-sm transition-colors hover:cursor-pointer hover:border-blue-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 dark:hover:border-blue-600">
								<Image
									src="/github.png"
									alt="Look at GitHub"
									className="rounded-sm"
									width={48}
									height={48}
								/>
								<div className="min-w-0 flex-1">
									<p className="truncate font-medium">View on GitHub</p>
									<p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
										View the source code for this website on GitHub.
									</p>
								</div>
							</div>
						</Link>
					</div>
				</footer>
			</main>
			<LoginDialog open={loginOpen} setOpen={setLoginOpen} />
		</>
	);
}
