export type SaveFileHandle = {
	getFile: () => Promise<File>;
};

export type FilePickerWindow = Window &
	typeof globalThis & {
		showOpenFilePicker?: () => Promise<SaveFileHandle[]>;
	};
