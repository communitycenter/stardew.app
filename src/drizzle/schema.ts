import {
	mysqlTable,
	mysqlSchema,
	AnyMySqlColumn,
	index,
	primaryKey,
	unique,
	varchar,
	json,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const saves = mysqlTable(
	"Saves",
	{
		id: varchar("_id", { length: 32 }).notNull(),
		userId: varchar("user_id", { length: 64 }).notNull(),
		general: json()
			.default(sql`JSON_OBJECT()`)
			.notNull(),
		fishing: json()
			.default(sql`JSON_OBJECT()`)
			.notNull(),
		cooking: json()
			.default(sql`JSON_OBJECT()`)
			.notNull(),
		crafting: json()
			.default(sql`JSON_OBJECT()`)
			.notNull(),
		shipping: json()
			.default(sql`JSON_OBJECT()`)
			.notNull(),
		museum: json()
			.default(sql`JSON_OBJECT()`)
			.notNull(),
		social: json()
			.default(sql`JSON_OBJECT()`)
			.notNull(),
		monsters: json()
			.default(sql`JSON_OBJECT()`)
			.notNull(),
		walnuts: json()
			.default(sql`JSON_OBJECT()`)
			.notNull(),
		notes: json()
			.default(sql`JSON_OBJECT()`)
			.notNull(),
		scraps: json()
			.default(sql`JSON_OBJECT()`)
			.notNull(),
		perfection: json()
			.default(sql`JSON_OBJECT()`)
			.notNull(),
		powers: json()
			.default(sql`JSON_OBJECT()`)
			.notNull(),
		bundles: json()
			.default(sql`JSON_ARRAY()`)
			.notNull(),
		rarecrows: json().default([]).notNull(),
		animals: json().default({}).notNull(),
	},

	(table) => [
		index("Saves_user_id").on(table.userId),
		primaryKey({
			columns: [table.id, table.userId],
			name: "Saves__id_user_id",
		}),
		unique("Unique_user_id_player").on(table.userId, table.id),
	],
);

export const users = mysqlTable(
	"Users",
	{
		id: varchar({ length: 64 }).notNull(),
		discordId: varchar("discord_id", { length: 191 }).notNull(),
		cookieSecret: varchar("cookie_secret", { length: 191 }).notNull(),
		discordAvatar: varchar("discord_avatar", { length: 64 }),
		discordName: varchar("discord_name", { length: 64 }).notNull(),
	},
	(table) => [
		index("Users_id").on(table.id),
		index("Users_discord_id").on(table.discordId),
		primaryKey({ columns: [table.id], name: "Users_id" }),
		unique("Users_discord_id_key").on(table.discordId),
		unique("Users_cookie_secret_key").on(table.cookieSecret),
	],
);
