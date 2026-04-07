import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import { createConnection } from "mysql2/promise";
import * as schema from "./schema";

export type Db = MySql2Database<typeof schema>;

export async function withDb<T>(callback: (db: Db) => Promise<T>): Promise<T> {
	const { env } = getCloudflareContext();
	const connection = await createConnection({
		host: env.HYPERDRIVE.host,
		user: env.HYPERDRIVE.user,
		password: env.HYPERDRIVE.password,
		database: env.HYPERDRIVE.database,
		port: env.HYPERDRIVE.port,
		disableEval: true,
		connectTimeout: 5000,
	});
	const db = drizzle(connection, { schema, mode: "default" });
	try {
		return await callback(db);
	} finally {
		await connection.end();
	}
}
