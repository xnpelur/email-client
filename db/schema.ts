import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const publicKeysTable = pgTable("public_keys", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar({ length: 255 }).notNull().unique(),
    publicKey: text("public_key").notNull(),
});

export const privateKeysTable = pgTable("private_keys", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar({ length: 255 }).notNull().unique(),
    privateKey: text("private_key").notNull(),
});
