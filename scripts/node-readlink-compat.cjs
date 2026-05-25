const fs = require("node:fs");

function shouldNormalizeReadlinkError(error, path) {
	if (!error || error.code !== "EISDIR") return false;

	try {
		return !fs.lstatSync(path).isSymbolicLink();
	} catch {
		return false;
	}
}

function normalizeReadlinkError(error) {
	error.code = "EINVAL";
	error.message = error.message.replace("EISDIR", "EINVAL");
	return error;
}

const originalReadlinkSync = fs.readlinkSync.bind(fs);
fs.readlinkSync = function readlinkSyncCompat(path, options) {
	try {
		return originalReadlinkSync(path, options);
	} catch (error) {
		if (shouldNormalizeReadlinkError(error, path)) {
			throw normalizeReadlinkError(error);
		}
		throw error;
	}
};

const originalReadlink = fs.readlink.bind(fs);
fs.readlink = function readlinkCompat(path, options, callback) {
	if (typeof options === "function") {
		callback = options;
		options = undefined;
	}

	return originalReadlink(path, options, (error, result) => {
		if (error && shouldNormalizeReadlinkError(error, path)) {
			callback(normalizeReadlinkError(error));
			return;
		}
		callback(error, result);
	});
};

const originalPromisesReadlink = fs.promises.readlink.bind(fs.promises);
fs.promises.readlink = async function promisesReadlinkCompat(path, options) {
	try {
		return await originalPromisesReadlink(path, options);
	} catch (error) {
		if (shouldNormalizeReadlinkError(error, path)) {
			throw normalizeReadlinkError(error);
		}
		throw error;
	}
};
