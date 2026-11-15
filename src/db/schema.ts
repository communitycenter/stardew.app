import {
	datetime,
	index,
	json,
	mysqlTable,
	primaryKey,
	varchar,
} from "drizzle-orm/mysql-core";

// Mirrors the live production tables. Production schema changes are applied
// by hand (see src/db/sql/), not with drizzle-kit migrate.

export const users = mysqlTable("Users", {
	id: varchar("id", { length: 64 }).notNull().primaryKey(),
	discord_id: varchar("discord_id", { length: 191 }).notNull().unique(),
	cookie_secret: varchar("cookie_secret", { length: 191 }).notNull().unique(),
	discord_avatar: varchar("discord_avatar", { length: 64 }).notNull(),
	discord_name: varchar("discord_name", { length: 64 }).notNull(),
});

export const saves = mysqlTable(
	"Saves",
	{
		_id: varchar("_id", { length: 32 }).notNull(),
		user_id: varchar("user_id", { length: 64 }).notNull(),
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
		// Last write to this save (UTC). NULL = not written since 2026-11-14,
		// when tracking began. The column also has ON UPDATE CURRENT_TIMESTAMP
		// in MySQL; writes set it explicitly too.
		updated_at: datetime("updated_at", { mode: "string" }),
	},
	(table) => [
		primaryKey({ columns: [table._id, table.user_id] }),
		index("Saves_user_id").on(table.user_id),
	],
);
