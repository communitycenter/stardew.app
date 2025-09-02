import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./apps/stardew.app/src/db/schema.ts",
  out: "./apps/stardew.app/src/drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
