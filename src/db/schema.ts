import { index, json, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import {mysqlEnum, primaryKey} from "drizzle-orm/mysql-core";

export const users = mysqlTable(
	"Users",
	{
		id: varchar("id", { length: 64 }).notNull().unique().primaryKey(),
		discord_id: varchar("discord_id", { length: 191 }).notNull().unique(),
		cookie_secret: varchar("cookie_secret", { length: 191 }).notNull().unique(),
		discord_avatar: varchar("discord_avatar", { length: 64 }).notNull(),
		discord_name: varchar("discord_name", { length: 64 }).notNull(),
	},
	(table) => {
		return {
			id: index("Users_id").on(table.id),
			discord_id: index("Users_discord_id").on(table.discord_id),
		};
	},
);

export const saves = mysqlTable(
	"Saves",
	{
		_id: varchar("_id", { length: 64 }).notNull().unique().primaryKey(),
		farmId: varchar("farm_id", { length: 64 }).notNull(),
		general: json("general").notNull().default({}),
		fishing: json("fishing").notNull().default({}),
		cooking: json("cooking").notNull().default({}),
		crafting: json("crafting").notNull().default({}),
		shipping: json("shipping").notNull().default({}),
		museum: json("museum").notNull().default({}),
		social: json("social").notNull().default({}),
		monsters: json("monsters").notNull().default({}),
		walnuts: json("walnuts").notNull().default({}),
		notes: json("notes").notNull().default({}),
		scraps: json("scraps").notNull().default({}),
		perfection: json("perfection").notNull().default({}),
		powers: json("powers").notNull().default({}),
		bundles: json("bundles").notNull().default([]),
		rarecrows: json("rarecrows").notNull().default([]),
		animals: json("animals").notNull().default({}),
	});


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