import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const publicKeysTable = pgTable("public_keys", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar({ length: 255 }).notNull().unique(),
    publicKey: varchar("public_key", { length: 255 }).notNull(),
});

export const privateKeysTable = pgTable("private_keys", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar({ length: 255 }).notNull().unique(),
    privateKey: varchar("private_key", { length: 255 }).notNull(),
});
