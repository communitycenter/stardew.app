import Head from "next/head";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { normalizeSaveXml } from "@/lib/console-save";
import { readBestSaveFileText } from "@/lib/save-loader";

interface LoadedSave {
	fileName: string;
	xml: string;
	farmerName: string;
	farmName: string;
	saveId: string;
	gameVersion: string;
}

function getTextContent(document: Document, tagName: string): string {
	return document.getElementsByTagName(tagName).item(0)?.textContent?.trim() || "";
}

function getLoadedSave(fileName: string, text: string): LoadedSave {
	const xml = normalizeSaveXml(text);
	const document = new DOMParser().parseFromString(xml, "text/xml");
	const parseError = document.getElementsByTagName("parsererror").item(0);

	if (parseError) {
		throw new Error("The selected payload could not be parsed as Stardew XML.");
	}

	return {
		fileName,
		xml,
		farmerName: getTextContent(document, "name") || "Unknown farmer",
		farmName: getTextContent(document, "farmName") || "Unknown farm",
		saveId: getTextContent(document, "uniqueIDForThisGame"),
		gameVersion: getTextContent(document, "gameVersion") || "Unknown version",
	};
}

function getBaseName(fileName: string): string {
	return fileName.replace(/\.[^.]+$/, "") || "stardew-save";
}

function downloadBlob(blob: Blob, fileName: string): void {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
}

async function deflateXml(xml: string): Promise<Blob> {
	if (typeof CompressionStream === "undefined") {
		throw new Error("This browser does not support save compression.");
	}

	const stream = new Blob([xml], { type: "text/xml" })
		.stream()
		.pipeThrough(new CompressionStream("deflate"));
	return await new Response(stream).blob();
}

export default function Converter() {
	const [loadedSave, setLoadedSave] = useState<LoadedSave | null>(null);
	const [isExporting, setIsExporting] = useState(false);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const folderInputRef = useRef<HTMLInputElement | null>(null);

	const pcFileName = useMemo(() => {
		if (!loadedSave) return "stardew-save";
		if (loadedSave.farmerName !== "Unknown farmer" && loadedSave.saveId) {
			return `${loadedSave.farmerName}_${loadedSave.saveId}`;
		}
		return `${getBaseName(loadedSave.fileName)}.xml`;
	}, [loadedSave]);

	const consoleFileName = useMemo(() => {
		if (!loadedSave) return "stardew-save";
		if (loadedSave.saveId) return `${loadedSave.farmerName}_${loadedSave.saveId}`;
		return getBaseName(loadedSave.fileName);
	}, [loadedSave]);

	const loadFiles = async (files: FileList | null) => {
		if (!files?.length) return;

		const promise = (async () => {
			const { file, text } = await readBestSaveFileText(files);
			setLoadedSave(getLoadedSave(file.name, text));
		})();

		toast.promise(promise, {
			loading: "Reading save payload",
			success: "Save payload loaded",
			error: (err) =>
				`Error loading save: ${
					err instanceof Error ? err.message : "Unknown error."
				}`,
		});
	};

	const exportPcXml = () => {
		if (!loadedSave) return;
		downloadBlob(
			new Blob([loadedSave.xml], { type: "text/xml" }),
			pcFileName,
		);
	};

	const exportCompressedPayload = async () => {
		if (!loadedSave) return;
		setIsExporting(true);
		try {
			const blob = await deflateXml(loadedSave.xml);
			downloadBlob(blob, consoleFileName);
			toast.success("Compressed console payload exported");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "The console payload could not be exported.",
			);
		} finally {
			setIsExporting(false);
		}
	};

	const folderInputProps = {
		webkitdirectory: "",
		directory: "",
	} as Record<string, string>;

	return (
		<>
			<Head>
				<title>Save Converter | stardew.app</title>
				<meta
					name="description"
					content="Convert Stardew Valley save payloads between PC XML and compressed console payload formats."
				/>
			</Head>
			<main className="min-h-screen border-neutral-200 px-5 pb-8 pt-6 dark:border-neutral-800 md:border-l md:px-8">
				<div className="mx-auto max-w-4xl space-y-6">
					<div className="space-y-2">
						<h1 className="text-3xl font-bold">Save Converter</h1>
						<p className="text-neutral-600 dark:text-neutral-400">
							Load a PC XML save, PS4 payload, PS Vita payload, or an exported
							save folder. Export either plain PC XML or a compressed console
							payload for reinjection with your console save tool.
						</p>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<Card className="rounded-lg">
							<CardHeader>
								<CardTitle>Open Save Payload</CardTitle>
								<CardDescription>
									Use this for a PC save file, SAVEDATA00 payload, or any single
									decrypted Stardew save payload.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button onClick={() => inputRef.current?.click()}>
									Choose File
								</Button>
								<input
									ref={inputRef}
									type="file"
									className="hidden"
									multiple
									onChange={(event: ChangeEvent<HTMLInputElement>) =>
										loadFiles(event.target.files)
									}
								/>
							</CardContent>
						</Card>

						<Card className="rounded-lg">
							<CardHeader>
								<CardTitle>Open Save Folder</CardTitle>
								<CardDescription>
									Use this for exported PlayStation folders that include farm
									payloads, SaveGameInfo, and metadata files.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button
									variant="outline"
									onClick={() => folderInputRef.current?.click()}
								>
									Choose Folder
								</Button>
								<input
									ref={folderInputRef}
									type="file"
									className="hidden"
									multiple
									{...folderInputProps}
									onChange={(event: ChangeEvent<HTMLInputElement>) =>
										loadFiles(event.target.files)
									}
								/>
							</CardContent>
						</Card>
					</div>

					<Card className="rounded-lg">
						<CardHeader>
							<CardTitle>Loaded Save</CardTitle>
							<CardDescription>
								The converter changes only the Stardew save payload. PS4 sealed
								containers and account encryption still need your normal save
								manager.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{loadedSave ? (
								<>
									<div className="grid gap-3 text-sm md:grid-cols-2">
										<div>
											<p className="text-neutral-500 dark:text-neutral-400">
												Source file
											</p>
											<p className="break-all font-medium">
												{loadedSave.fileName}
											</p>
										</div>
										<div>
											<p className="text-neutral-500 dark:text-neutral-400">
												Game version
											</p>
											<p className="font-medium">{loadedSave.gameVersion}</p>
										</div>
										<div>
											<p className="text-neutral-500 dark:text-neutral-400">
												Farmer
											</p>
											<p className="font-medium">{loadedSave.farmerName}</p>
										</div>
										<div>
											<p className="text-neutral-500 dark:text-neutral-400">
												Farm
											</p>
											<p className="font-medium">{loadedSave.farmName}</p>
										</div>
									</div>
									<div className="flex flex-wrap gap-3">
										<Button onClick={exportPcXml}>Export PC XML</Button>
										<Button
											variant="outline"
											disabled={isExporting}
											onClick={exportCompressedPayload}
										>
											Export PS4 / Vita Payload
										</Button>
									</div>
								</>
							) : (
								<p className="text-sm text-neutral-500 dark:text-neutral-400">
									No save loaded yet.
								</p>
							)}
						</CardContent>
					</Card>
				</div>
			</main>
		</>
	);
}
