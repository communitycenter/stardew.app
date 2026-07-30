import {
	mysqlTable,
	mysqlSchema,
	AnyMySqlColumn,
	index,
	primaryKey,
	unique,
	varchar,
	json, mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const saves = mysqlTable(
	"Saves",
	{
		_id: varchar("_id", { length: 32 }).notNull().primaryKey(),
		farmId: varchar("farm_id", { length: 64 }).notNull(),
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
	});

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

export const ownership = mysqlTable(
	"Ownership",
	{
		userId: varchar("user_id", { length: 64 })
			.notNull()
			.references(() => users.id),

		saveId: varchar("save_id", { length: 32 })
			.notNull()
			.references(() => saves._id),

		role: mysqlEnum("role", ["owner", "editor", "viewer"])
			.default("viewer")
			.notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.userId, table.saveId],
		}),
	],
);