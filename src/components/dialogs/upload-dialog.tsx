import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { PlayersContext } from "@/contexts/players-context";
import { parseSaveFile } from "@/lib/file";
import type { FilePickerWindow, SaveFileHandle } from "@/types/save-sync";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface Props {
	open: boolean;
	setOpen: (open: boolean) => void;
}

interface InstructionsDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	platform: "Mac" | "Windows" | "Linux" | "Switch";
}

const InstructionsDialog = ({
	open,
	setOpen,
	platform,
}: InstructionsDialogProps) => {
	const getInstructions = () => {
		switch (platform) {
			case "Mac":
				return {
					title: "Finding your save file on Mac",
					path: "~/.config/StardewValley/Saves",
					steps: [
						"1. Open Finder",
						"2. Press Cmd + Shift + G",
						"3. Paste this path: ~/.config/StardewValley/Saves",
						"4. Your save files will be in this folder",
						"5. Look for a file named with your farmer's name and a number (e.g. 'Farmer_123456789')",
					],
				};
			case "Windows":
				return {
					title: "Finding your save file on Windows",
					path: "%appdata%\\StardewValley\\Saves",
					steps: [
						"1. Press Windows key + R",
						"2. Paste this path: %appdata%\\StardewValley\\Saves",
						"3. Your save files will be in this folder",
						"4. Look for a file named with your farmer's name and a number (e.g. 'Farmer_123456789')",
					],
				};
			case "Linux":
				return {
					title: "Finding your save file on Linux",
					path: "~/.config/StardewValley/Saves",
					steps: [
						"1. Open your file manager",
						"2. Press Alt + F2",
						"3. Paste this path: ~/.config/StardewValley/Saves",
						"4. Your save files will be in this folder",
						"5. Look for a file named with your farmer's name and a number (e.g. 'Farmer_123456789')",
					],
				};
			case "Switch":
				return {
					title: "Nintendo Switch Save Files",
					path: "",
					steps: [
						"Unfortunately, we don't support direct save file uploading from Nintendo Switch unless your console is modded.",
						"",
						"If you want to track your progress, you'll need to manually enter your achievements and progress in the editor.",
						"",
						"We apologize for any inconvenience this may cause.",
					],
				};
		}
	};

	const instructions = getInstructions();

	// Copy path to clipboard when dialog opens
	if (open && instructions && instructions.path) {
		navigator.clipboard.writeText(instructions.path);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{instructions.title}</DialogTitle>
				</DialogHeader>
				<DialogDescription className="space-y-2">
					{instructions.path && (
						<p className="text-muted-foreground text-sm">
							(We&apos;ve already copied the path to your clipboard!)
						</p>
					)}
					{instructions.steps.map((step, index) => (
						<p key={index}>{step}</p>
					))}
				</DialogDescription>
				<DialogFooter className="sm:justify-left flex flex-col gap-2 sm:flex-row">
					{platform === "Switch" ? (
						<Button onClick={() => setOpen(false)}>Close</Button>
					) : (
						<>
							<Button variant="secondary" asChild>
								<a
									href="https://stardew.app/discord"
									target="_blank"
									rel="noopener noreferrer"
								>
									I need more help...
								</a>
							</Button>
							<Button onClick={() => setOpen(false)}>I found it!</Button>
						</>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export const UploadDialog = ({ open, setOpen }: Props) => {
	const router = useRouter();
	const { uploadPlayers, connectAutoSync } = useContext(PlayersContext);
	const [instructionsOpen, setInstructionsOpen] = useState(false);
	const [selectedPlatform, setSelectedPlatform] = useState<
		"Mac" | "Windows" | "Linux" | "Switch"
	>("Mac");
	// Starts false on both server and client so the first client render still
	// matches the SSR'd markup; flips right after mount once we can check.
	const [supportsAutoSync, setSupportsAutoSync] = useState(false);

	useEffect(() => {
		setSupportsAutoSync(
			typeof (window as FilePickerWindow).showOpenFilePicker === "function",
		);
	}, []);

	const uploadFile = useCallback(
		async (file: File, redirectToFarm: boolean) => {
			if (typeof file === "undefined" || !file) return;

			if (file.type !== "") {
				throw new Error("Please select a Stardew Valley save file.");
			}

			const saveText = await file.text();
			const players = parseSaveFile(saveText);
			const farmId = players[0]?.farmId;
			await uploadPlayers(players);

			if (redirectToFarm && farmId) {
				await router.push(`/farm/${farmId}`);
			}
		},
		[router, uploadPlayers],
	);

	// Handles a file from either the dropzone or the file picker. On browsers
	// with the File System Access API, both paths can hand us a durable
	// FileSystemFileHandle alongside the File — when they do, that's the
	// trigger for automatic sync (owned by PlayersProvider, since this dialog
	// itself is mounted more than once across the app). There's no separate
	// "connect" step.
	const handleIncomingFile = useCallback(
		(file: File & { handle?: SaveFileHandle }) => {
			if (typeof file === "undefined" || !file) return;

			setOpen(false);
			toast.promise(uploadFile(file, true), {
				loading: "Uploading your save file...",
				success: file.handle
					? "Uploaded! We'll keep this save synced while this tab is open."
					: "Your save file was successfully uploaded!",
				error: (err) => `There was an error parsing your save file:\n${err}`,
			});

			if (file.handle) {
				connectAutoSync(file.handle, file);
			}
		},
		[connectAutoSync, setOpen, uploadFile],
	);

	// Only meaningful on browsers with the File System Access API; falls back
	// to react-dropzone's own `open()` (the classic <input type="file">)
	// everywhere else, which can only ever produce a one-time upload.
	const pickFileWithHandle = useCallback(async () => {
		const pickerWindow = window as FilePickerWindow;
		if (!pickerWindow.showOpenFilePicker) return;

		try {
			// Stardew's save files do not have a file extension, so this must allow
			// all files instead of filtering for XML.
			const [handle] = await pickerWindow.showOpenFilePicker();
			const file = await handle.getFile();
			handleIncomingFile(Object.assign(file, { handle }));
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") return;
			toast.error("Could not open your save file", {
				description: err instanceof Error ? err.message : "Unknown error.",
			});
		}
	}, [handleIncomingFile]);

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Upload your save file</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						<Dropzone
							noClick
							useFsAccessApi={false}
							onDrop={(acceptedFiles) => {
								handleIncomingFile(
									acceptedFiles[0] as File & { handle?: SaveFileHandle },
								);
							}}
						>
							{({ getRootProps, getInputProps, open }) => (
								<>
									<input className="h-full w-full" {...getInputProps()} />
									<div className="h-[250px]">
										<div
											{...getRootProps({
												onClick: (event) => {
													event.preventDefault();
													const pickerWindow = window as FilePickerWindow;
													if (pickerWindow.showOpenFilePicker) {
														void pickFileWithHandle();
													} else {
														open();
													}
												},
											})}
											className="flex h-full w-full cursor-pointer select-none items-center justify-center rounded-lg border-2 border-dashed border-gray-800 dark:border-gray-400"
										>
											<div className="select-text text-center">
												<p>
													Drag and drop your save file here, or click to browse!
												</p>
												{supportsAutoSync && (
													<p className="text-muted-foreground mt-1 text-xs">
														We&apos;ll keep it synced automatically while this
														tab is open.
													</p>
												)}
											</div>
										</div>
									</div>
								</>
							)}
						</Dropzone>
					</DialogDescription>
					<div className="space-y-4">
						<div className="text-left">
							<p className="font-medium">Need help finding your save?</p>
							<p className="text-muted-foreground text-sm">
								What do you play on?
							</p>
						</div>
						<div className="grid grid-cols-2 gap-2">
							<Button
								variant={"secondary"}
								onClick={() => {
									setSelectedPlatform("Mac");
									setInstructionsOpen(true);
								}}
								className="w-full"
							>
								Mac
							</Button>
							<Button
								variant={"secondary"}
								onClick={() => {
									setSelectedPlatform("Windows");
									setInstructionsOpen(true);
								}}
								className="w-full"
							>
								Windows
							</Button>
							<Button
								variant={"secondary"}
								onClick={() => {
									setSelectedPlatform("Linux");
									setInstructionsOpen(true);
								}}
								className="w-full"
							>
								Linux
							</Button>
							<Button
								variant={"secondary"}
								onClick={() => {
									setSelectedPlatform("Switch");
									setInstructionsOpen(true);
								}}
								className="w-full"
							>
								Nintendo Switch
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
			<InstructionsDialog
				open={instructionsOpen}
				setOpen={setInstructionsOpen}
				platform={selectedPlatform}
			/>
		</>
	);
};
