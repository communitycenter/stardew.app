import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default {
	...defineCloudflareConfig(),
	// Next 16 builds with Turbopack by default, but OpenNext 1.20 can't bundle
	// that output yet (it fails resolving Next's dev-only server modules).
	buildCommand: "next build --webpack",
};
