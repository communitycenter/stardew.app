import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import { cache } from "react";
import * as schema from "./schema";

export type Db = MySql2Database<typeof schema>;

export const getDb = cache(() => {
	const url = new URL(process.env.DATABASE_URL!);

	const pool = createPool({
    	host: url.hostname,
    	port: Number(url.port),
    	user: decodeURIComponent(url.username),
    	password: decodeURIComponent(url.password),
    	database: url.pathname.slice(1),
    	connectionLimit: 10,
	});

	return drizzle(pool, { schema, mode: "default"});
});

export async function withDb<T>(callback: (db: Db) => Promise<T>): Promise<T> {
	return callback(getDb());
}
