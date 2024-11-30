import { eq } from "drizzle-orm";
import { privateKeysTable, publicKeysTable } from "@/db/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { generateKeyPairSync } from "crypto";

const db = drizzle(process.env.DATABASE_URL!);

export async function getPublicKey(email: string): Promise<string | null> {
    const result = await db
        .select()
        .from(publicKeysTable)
        .where(eq(publicKeysTable.email, email));

    if (result.length === 0) {
        return null;
    }
    return result[0].publicKey;
}

export async function getPrivateKey(email: string): Promise<string | null> {
    const result = await db
        .select()
        .from(privateKeysTable)
        .where(eq(privateKeysTable.email, email));

    if (result.length === 0) {
        return null;
    }
    return result[0].privateKey;
}

export async function createKeyPair(email: string): Promise<void> {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
        modulusLength: 2048,
    });

    const publicKeyString = publicKey.export({
        type: "pkcs1",
        format: "pem",
    }) as string;
    const privateKeyString = privateKey.export({
        type: "pkcs1",
        format: "pem",
    }) as string;

    await db.insert(publicKeysTable).values({
        email,
        publicKey: publicKeyString,
    });
    await db.insert(privateKeysTable).values({
        email,
        privateKey: privateKeyString,
    });
}
