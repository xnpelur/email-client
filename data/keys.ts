import { eq } from "drizzle-orm";
import { privateKeysTable, publicKeysTable } from "@/db/schema";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(process.env.DATABASE_URL!);

export async function getPublicKey(email: string) {
    const result = await db
        .select()
        .from(publicKeysTable)
        .where(eq(publicKeysTable.email, email));

    return result[0].publicKey;
}

export async function getPrivateKey(email: string) {
    const result = await db
        .select()
        .from(privateKeysTable)
        .where(eq(privateKeysTable.email, email));

    return result[0].privateKey;
}

export async function createKeyPair(email: string) {
    await db.insert(publicKeysTable).values({
        email,
        publicKey: "publicKey",
    });
    await db.insert(privateKeysTable).values({
        email,
        privateKey: "privateKey",
    });
}
