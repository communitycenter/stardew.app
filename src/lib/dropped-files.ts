import type { SaveFileHandle } from "@/types/save-sync";
import type { DropEvent } from "react-dropzone";

type DroppedFile = File & { handle?: SaveFileHandle };

type FileSystemHandleItem = DataTransferItem & {
	getAsFileSystemHandle?: () => Promise<
		(SaveFileHandle & { kind: "file" | "directory" }) | null
	>;
};

// react-dropzone's default reader asks for the File System Access handle
// first and gives up on the drop when the handle is missing or can't be
// read, and it does so silently. Some Chrome setups hand back exactly that
// kind of handle, so dropping a save did nothing at all. This reads the file
// itself first, while the drop data is still available (it's gone after the
// first await), and only keeps the handle for auto-sync when it can actually
// be read.
export async function getDroppedFiles(
	event: DropEvent,
): Promise<(DroppedFile | DataTransferItem)[]> {
	// Picking with the file input (the browse fallback on browsers without
	// auto-sync).
	if (Array.isArray(event)) {
		return Promise.all(event.map((handle) => handle.getFile()));
	}
	const dataTransfer =
		"dataTransfer" in event ? (event as DragEvent).dataTransfer : null;
	if (!dataTransfer) {
		const input = event.target as HTMLInputElement | null;
		return Array.from(input?.files ?? []);
	}

	const items = Array.from(dataTransfer.items).filter(
		(item) => item.kind === "file",
	);
	// Drag enter/over only need the items to show the drop state.
	if (event.type !== "drop") return items;

	const files = items.map((item) => item.getAsFile());
	const handles = items.map((item: FileSystemHandleItem) =>
		globalThis.isSecureContext &&
		typeof item.getAsFileSystemHandle === "function"
			? item.getAsFileSystemHandle().catch(() => null)
			: Promise.resolve(null),
	);

	const dropped = await Promise.all(
		files.map(async (file, index) => {
			if (!file) return null;
			const handle = await handles[index];
			if (handle?.kind !== "file") return file as DroppedFile;
			try {
				await handle.getFile();
				return Object.assign(file, { handle }) as DroppedFile;
			} catch (error) {
				console.warn("Dropped file can't be re-read, so it won't auto-sync:", error);
				return file as DroppedFile;
			}
		}),
	);
	return dropped.filter((file): file is DroppedFile => file !== null);
}
