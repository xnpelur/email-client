import {
    createCipheriv,
    randomBytes,
    createDecipheriv,
    publicEncrypt,
    privateDecrypt,
} from "crypto";

export function encrypt(data: Buffer, publicKey: string): Buffer {
    const tripleDESKey = randomBytes(24);

    const cipher = createCipheriv("des-ede3", tripleDESKey, null);
    const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);

    const encryptedKey = publicEncrypt(publicKey, tripleDESKey);

    const keyLength = Buffer.alloc(4);
    keyLength.writeUInt32BE(encryptedKey.length);

    return Buffer.concat([keyLength, encryptedKey, encryptedData]);
}

export function decrypt(data: Buffer, privateKey: string): Buffer {
    const keyLength = data.readUInt32BE(0);

    const encryptedKey = data.subarray(4, 4 + keyLength);
    const encryptedData = data.subarray(4 + keyLength);

    const tripleDESKey = privateDecrypt(privateKey, encryptedKey);

    const decipher = createDecipheriv("des-ede3", tripleDESKey, null);
    return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
}
