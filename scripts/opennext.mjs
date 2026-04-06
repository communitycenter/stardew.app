const command = Bun.argv[2];

if (command !== "preview" && command !== "deploy") {
	console.error("Usage: bun scripts/opennext.mjs <preview|deploy>");
	process.exit(1);
}

const cli = Bun.which("opennextjs-cloudflare");

if (!cli) {
	console.error("Could not find the opennextjs-cloudflare CLI.");
	process.exit(1);
}

async function run(args) {
	const subprocess = Bun.spawn({
		cmd: [cli, ...args],
		env: process.env,
		stdin: "inherit",
		stdout: "inherit",
		stderr: "inherit",
	});

	const exitCode = await subprocess.exited;

	if (exitCode !== 0) {
		process.exit(exitCode);
	}
}

await run(["build"]);
await run([command]);
