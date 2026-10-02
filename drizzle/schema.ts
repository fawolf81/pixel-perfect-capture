import { jsonb, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { authUid, authenticatedRole, crudPolicy } from "drizzle-orm/neon";

export const accountEntitlements = pgTable(
	"account_entitlements",
	{
		userId: text("user_id").primaryKey(),
		plan: text("plan").notNull().default("free"),
		premiumUntil: timestamp("premium_until", { withTimezone: true }),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		crudPolicy({
			role: authenticatedRole,
			read: authUid(table.userId),
			modify: false,
		}),
	],
);

export const gameSaves = pgTable(
	"game_saves",
	{
		userId: text("user_id").primaryKey(),
		state: jsonb("state").notNull(),
		screen: text("screen").notNull().default("painel"),
		schemaVersion: integer("schema_version").notNull().default(1),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		crudPolicy({
			role: authenticatedRole,
			read: authUid(table.userId),
			modify: authUid(table.userId),
		}),
	],
);
// auto-generated and intentionally left blank, do not edit
