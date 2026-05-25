import { normalizeSaveXml } from "@/lib/console-save";

const METADATA_NAMES = new Set([
	"SaveGameInfo",
	"startup_preferences",
	"param.sfo",
	"icon0.png",
	"keystone",
]);

function getFilePath(file: File): string {
	const maybePath = file as File & { webkitRelativePath?: string; path?: string };
	return maybePath.webkitRelativePath || maybePath.path || file.name;
}

function rankSaveCandidate(file: File): number {
	const path = getFilePath(file).replace(/\\/g, "/");
	const name = file.name;
	let rank = 0;

	if (path.includes("/sce_sys/") || path.startsWith("sce_sys/")) rank += 1000;
	if (METADATA_NAMES.has(name)) rank += 1000;
	if (/\.bin$/i.test(name) || name.includes("pfsSKKey")) rank += 1000;
	if (file.size < 1024) rank += 100;

	if (!METADATA_NAMES.has(name) && !path.includes("/sce_sys/") && !/\.bin$/i.test(name)) {
		rank -= 100;
	}

	return rank;
}

export function getSaveCandidates(files: File[] | FileList): File[] {
	return Array.from(files).sort((a, b) => {
		const rankDiff = rankSaveCandidate(a) - rankSaveCandidate(b);
		if (rankDiff !== 0) return rankDiff;
		return b.size - a.size;
	});
}

async function inflateWithNativeStream(
	buffer: ArrayBuffer,
	format: CompressionFormat,
): Promise<string> {
	if (typeof DecompressionStream === "undefined") {
		throw new Error("This browser does not support native save decompression.");
	}

	const stream = new Blob([buffer])
		.stream()
		.pipeThrough(new DecompressionStream(format));
	return await new Response(stream).text();
}

function decodeUtf8(buffer: ArrayBuffer): string {
	return new TextDecoder("utf-8").decode(buffer);
}

function assertSaveGamePayload(text: string): void {
	if (!normalizeSaveXml(text).includes("<SaveGame")) {
		throw new Error(
			"This file is not a complete Stardew Valley SaveGame payload.",
		);
	}
}

export async function readSaveFileText(file: File): Promise<string> {
	const buffer = await file.arrayBuffer();

	for (const format of ["deflate", "deflate-raw", "gzip"] as CompressionFormat[]) {
		try {
			const text = await inflateWithNativeStream(buffer, format);
			assertSaveGamePayload(text);
			return text;
		} catch {
			// Try the next compression format, then fall back to plain UTF-8 XML.
		}
	}

	const text = decodeUtf8(buffer);
	assertSaveGamePayload(text);
	return text;
}

export async function readBestSaveFileText(files: File[] | FileList): Promise<{
	file: File;
	text: string;
}> {
	const candidates = getSaveCandidates(files);
	let lastError: unknown = null;

	for (const file of candidates) {
		try {
			return {
				file,
				text: await readSaveFileText(file),
			};
		} catch (error) {
			lastError = error;
		}
	}

	throw lastError instanceof Error
		? lastError
		: new Error("No save payload was found in the selected file or folder.");
}
