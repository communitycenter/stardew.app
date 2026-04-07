import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import * as schema from "./schema";

export type Db = MySql2Database<typeof schema>;

let _db: Db | undefined;

export function getDb(): Db {
	if (_db) return _db;

	const { env } = getCloudflareContext();
	_db = drizzle(
		createPool({
			host: env.HYPERDRIVE.host,
			user: env.HYPERDRIVE.user,
			password: env.HYPERDRIVE.password,
			database: env.HYPERDRIVE.database,
			port: env.HYPERDRIVE.port,
			disableEval: true,
			connectionLimit: 1,
		}),
		{ schema, mode: "default" },
	);
	return _db;
}

export async function withDb<T>(callback: (db: Db) => Promise<T>): Promise<T> {
	return callback(getDb());
}
