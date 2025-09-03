import * as fs from "fs";
import * as path from "path";

// Import the actual parseSaveFile function from file.ts
import { parseSaveFile } from "../apps/stardew.app/src/lib/file";

// Ensure output directory exists
function ensureOutputDir() {
  const outputDir = path.join(__dirname, "./output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  return outputDir;
}

// Process a single save file
async function processSaveFile(saveFilePath: string, outputDir: string) {
  const fileName = path.basename(saveFilePath);
  const outputFileName = `${fileName}.json`;
  const outputPath = path.join(outputDir, outputFileName);

  try {
    const xml = fs.readFileSync(saveFilePath, "utf8");
    const result = parseSaveFile(xml);
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    return { success: true, players: result.length, fileName };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage, fileName };
  }
}

// Main function
async function main() {
  const savesDir = path.join(__dirname, "./saves");
  const outputDir = ensureOutputDir();

  // Check if saves directory exists
  if (!fs.existsSync(savesDir)) {
    process.exit(1);
  }

  // Get all files in the saves directory
  const files = fs.readdirSync(savesDir);
  const saveFiles = files.filter(
    (file) =>
      !file.startsWith(".") &&
      !fs.statSync(path.join(savesDir, file)).isDirectory()
  );

  if (saveFiles.length === 0) {
    process.exit(1);
  }

  const results: Array<{
    success: boolean;
    players?: number;
    fileName: string;
    error?: string;
  }> = [];
  let successCount = 0;
  let errorCount = 0;

  // Process each save file
  for (const file of saveFiles) {
    const saveFilePath = path.join(savesDir, file);
    const result = await processSaveFile(saveFilePath, outputDir);
    results.push(result);

    if (result.success) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  // Summary - no output needed
}

// Run the test
main().catch(() => process.exit(1));
