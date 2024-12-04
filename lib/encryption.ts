import { createCipheriv, randomBytes, createDecipheriv } from "crypto";

export function encrypt(data: Buffer): Buffer {
    const key = randomBytes(24);

    const cipher = createCipheriv("des-ede3", key, null);
    const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);

    return Buffer.concat([key, encryptedData]);
}

export function decrypt(data: Buffer): Buffer {
    const key = data.subarray(0, 24);
    const encryptedData = data.subarray(24);

    const decipher = createDecipheriv("des-ede3", key, null);
    return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
}
