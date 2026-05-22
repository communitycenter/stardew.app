export type SavePlatform = "PC" | "Mobile" | "Console";

export type SaveInputFormat =
	| "xml"
	| "decrypted-console-xml"
	| "compressed-console-save"
	| "ps4-pfs-key"
	| "ps4-save-container"
	| "unknown";

export interface SaveInputValidation {
	format: SaveInputFormat;
	isXml: boolean;
	isLikelyDecryptedConsoleSave: boolean;
	isRawConsoleContainer: boolean;
	reason: string;
}

const XML_DECLARATION = "<?xml";
const SAVE_GAME_ROOT = "<SaveGame";
const PFS_KEY_SIGNATURE = "pfsSKKey";

function trimLeadingNoise(input: string): string {
	return input
		.replace(/^\uFEFF/, "")
		.replace(/^[\u0000-\u0008\u000B\u000C\u000E-\u001F]+/, "");
}

export function normalizeSaveXml(input: string): string {
	const normalized = trimLeadingNoise(input);
	const xmlIndex = normalized.indexOf(XML_DECLARATION);
	const saveGameIndex = normalized.indexOf(SAVE_GAME_ROOT);

	if (xmlIndex > 0) return normalized.slice(xmlIndex);
	if (xmlIndex === 0) return normalized;
	if (saveGameIndex > 0) return normalized.slice(saveGameIndex);

	return normalized;
}

export function validateDecryptedConsoleSave(input: string): SaveInputValidation {
	const normalized = normalizeSaveXml(input);
	const startsWithPfsKey = input.startsWith(PFS_KEY_SIGNATURE);
	const startsWithXml =
		normalized.startsWith(XML_DECLARATION) || normalized.startsWith(SAVE_GAME_ROOT);
	const hasSaveGameRoot = normalized.includes(SAVE_GAME_ROOT);
	const hasStandardStardewNamespaces =
		normalized.includes("xmlns:xsi=") || normalized.includes("xmlns:p3=");

	if (startsWithPfsKey) {
		return {
			format: "ps4-pfs-key",
			isXml: false,
			isLikelyDecryptedConsoleSave: false,
			isRawConsoleContainer: true,
			reason:
				"PS4 pfsSKKey metadata was uploaded. Select the matching exported save folder or the large save payload instead.",
		};
	}

	if (!startsWithXml && !hasSaveGameRoot) {
		const startsWithControlCharacter = input.charCodeAt(0) <= 0x1f;
		return {
			format: startsWithControlCharacter ? "ps4-save-container" : "unknown",
			isXml: false,
			isLikelyDecryptedConsoleSave: false,
			isRawConsoleContainer: startsWithControlCharacter,
			reason:
				"This does not contain visible Stardew Valley XML. If this is a PlayStation save, select the exported farm folder or compressed farm payload inside it.",
		};
	}

	return {
		format: hasStandardStardewNamespaces ? "decrypted-console-xml" : "xml",
		isXml: true,
		isLikelyDecryptedConsoleSave: hasStandardStardewNamespaces && hasSaveGameRoot,
		isRawConsoleContainer: false,
		reason:
			"Stardew Valley XML save detected. Decrypted PS4 and PS Vita saves use this same XML structure after extraction.",
	};
}

export function getTypeAttributePrefix(saveGame: any): "xsi" | "p3" {
	if (typeof saveGame?.["@_xmlns:xsi"] !== "undefined") return "xsi";
	if (typeof saveGame?.["@_xmlns:p3"] !== "undefined") return "p3";

	const locations = saveGame?.locations?.GameLocation;
	const locationList = Array.isArray(locations)
		? locations
		: locations
			? [locations]
			: [];
	for (const location of locationList) {
		if (typeof location?.["@_xsi:type"] !== "undefined") return "xsi";
		if (typeof location?.["@_p3:type"] !== "undefined") return "p3";
	}

	return "xsi";
}
