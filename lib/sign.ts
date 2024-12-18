import crypto from "crypto";

export function extractSignedContent(signedContent: string, publicKey: string) {
    const signature = signedContent.slice(0, 512);
    const content = signedContent.slice(512);

    const hash = crypto.createHash("sha256");
    hash.update(content);
    const digest = hash.digest("hex");

    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(digest);

    if (!verify.verify(publicKey, signature, "hex")) {
        throw new Error("Invalid signature");
    }

    return content;
}

export function signContent(content: string, privateKey: string) {
    const hash = crypto.createHash("sha256");
    hash.update(content);
    const fileHash = hash.digest("hex");

    const sign = crypto.createSign("RSA-SHA256");
    sign.update(fileHash);
    const signature = sign.sign(privateKey, "hex");

    if (signature.length !== 512) {
        throw new Error(
            `Invalid generated signature length: ${signature.length}`,
        );
    }

    return signature + content;
}
