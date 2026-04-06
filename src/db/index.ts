import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import { cache } from "react";
import * as schema from "./schema";

export type Db = MySql2Database<typeof schema>;

// cache() scopes this to a single request — subsequent calls within the same
// request return the same instance; a fresh pool is created for each new request.
export const getDb = cache(() => {
	const { env } = getCloudflareContext();
	return drizzle(createPool({
		host: env.HYPERDRIVE.host,
		user: env.HYPERDRIVE.user,
		password: env.HYPERDRIVE.password,
		database: env.HYPERDRIVE.database,
		port: env.HYPERDRIVE.port,
		disableEval: true,
	}), {
		schema,
		mode: "default",
	});
});

export async function withDb<T>(callback: (db: Db) => Promise<T>): Promise<T> {
	return callback(getDb());
}
