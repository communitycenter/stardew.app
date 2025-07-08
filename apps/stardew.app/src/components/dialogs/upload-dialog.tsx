import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { PlayersContext } from "@/contexts/players-context";

import { parseSaveFile } from "@communitycenter/stardew-save-parser";
import { useContext, useState } from "react";
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
	const { activePlayer, uploadPlayers } = useContext(PlayersContext);
	const [instructionsOpen, setInstructionsOpen] = useState(false);
	const [selectedPlatform, setSelectedPlatform] = useState<
		"Mac" | "Windows" | "Linux" | "Switch"
	>("Mac");

	const handleChange = (file: File) => {
		setOpen(false);

		if (typeof file === "undefined" || !file) return;

		if (file.type !== "") {
			toast.error("Invalid file type", {
				description: "Please upload a Stardew Valley save file.",
			});
			return;
		}

		const reader = new FileReader();

		let uploadPromise;

		reader.onloadstart = () => {
			uploadPromise = new Promise((resolve, reject) => {
				reader.onload = async function (event) {
					try {
						const players = parseSaveFile(event.target?.result as string);
						await uploadPlayers(players);
						resolve("Your save file was successfully uploaded!");
					} catch (err) {
						reject(err instanceof Error ? err.message : "Unknown error.");
					}
				};
			});

			// Start the loading toast
			toast.promise(uploadPromise, {
				loading: "Uploading your save file...",
				success: (data) => `${data}`,
				error: (err) => `There was an error parsing your save file:\n${err}`,
			});

			// Reset the input
			uploadPromise = null;
		};

		reader.readAsText(file);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Upload your save file</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						<Dropzone
							onDrop={(acceptedFiles) => {
								handleChange(acceptedFiles[0]);
							}}
							useFsAccessApi={false}
						>
							{({ getRootProps, getInputProps }) => (
								<>
									<input className="h-full w-full" {...getInputProps()} />
									<div className="h-[250px]">
										<div
											{...getRootProps()}
											className="flex h-full w-full cursor-pointer select-none items-center justify-center rounded-lg border-2 border-dashed border-gray-800 dark:border-gray-400"
										>
											<div className="select-text text-center">
												<p>
													Drag and drop your save file here, or click to browse!
												</p>
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
