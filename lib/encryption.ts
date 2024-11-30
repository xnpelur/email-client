import {
    createCipheriv,
    randomBytes,
    publicEncrypt,
    privateDecrypt,
    createDecipheriv,
} from "crypto";

export function encrypt(data: Buffer, publicKey: string): Buffer {
    const tripleDESKey = randomBytes(24);

    const cipher = createCipheriv("des-ede3", tripleDESKey, null);
    const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);

    const encryptedKey = publicEncrypt(publicKey, tripleDESKey);

    return Buffer.concat([encryptedKey, encryptedData]);
}

export function decrypt(data: Buffer, privateKey: string): Buffer {
    const tripleDESKey = privateDecrypt(privateKey, data.subarray(0, 24));
    const cipher = createDecipheriv("des-ede3", tripleDESKey, null);

    return Buffer.concat([cipher.update(data.subarray(24)), cipher.final()]);
}
