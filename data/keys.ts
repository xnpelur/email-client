import { eq } from "drizzle-orm";
import { privateKeysTable, publicKeysTable } from "@/db/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import {
    generateKeyPairSync,
    createCipheriv,
    createDecipheriv,
    scryptSync,
} from "crypto";

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

export async function getPrivateKey(
    email: string,
    password: string,
): Promise<string | null> {
    const result = await db
        .select()
        .from(privateKeysTable)
        .where(eq(privateKeysTable.email, email));

    if (result.length === 0) {
        return null;
    }

    return decryptPrivateKey(result[0].privateKey, password);
}

export async function createKeyPair(
    email: string,
    password: string,
): Promise<void> {
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
        privateKey: encryptPrivateKey(privateKeyString, password),
    });
}

function encryptPrivateKey(privateKey: string, password: string): string {
    const key = scryptSync(password, "salt", 24);
    const cipher = createCipheriv("des-ede3", key, Buffer.alloc(0));
    let encrypted = cipher.update(privateKey, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
}

function decryptPrivateKey(
    encryptedPrivateKey: string,
    password: string,
): string {
    const key = scryptSync(password, "salt", 24);
    const decipher = createDecipheriv("des-ede3", key, Buffer.alloc(0));
    let decrypted = decipher.update(encryptedPrivateKey, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
