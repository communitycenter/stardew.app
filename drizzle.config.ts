import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./src/drizzle",
	dialect: "mysql",
	dbCredentials: {
		url: process.env.CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE!,
	},
});
