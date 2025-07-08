import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { createConnection } from "mysql2";
import * as schema from "./schema";

export const connection = createConnection({
	uri: process.env.DATABASE_URL!,
	queueLimit: 0,
	connectionLimit: 10,
});

export const db = drizzle(connection, { schema, mode: "default" });
migrate(db, { migrationsFolder: "../drizzle" });
await connection.end();
