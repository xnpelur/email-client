import { encrypt, decrypt } from "@/lib/encrypt";
import { signContent, extractSignedContent } from "@/lib/sign";
import { Attachment } from "@/types/email";
import {
    base64ToBuffer,
    bufferToBase64,
    bufferToString,
    stringToBuffer,
} from "@/lib/utils";

export function signAndEncryptText(
    text: string,
    publicKey: string,
    privateKey: string,
) {
    const signedText = signContent(text, privateKey);
    const signedBuffer = stringToBuffer(signedText);
    const encryptedData = encrypt(signedBuffer, publicKey);
    const encryptedText = bufferToBase64(encryptedData);
    return encryptedText;
}

export function decryptAndExtractText(
    text: string,
    publicKey: string,
    privateKey: string,
) {
    const encryptedBuffer = base64ToBuffer(text);
    const decryptedBuffer = decrypt(encryptedBuffer, privateKey);
    const signedText = bufferToString(decryptedBuffer);
    const extractedText = extractSignedContent(signedText, publicKey);
    return extractedText;
}

export function signAndEncryptAttachments(
    attachments: Attachment[],
    publicKey: string,
    privateKey: string,
) {
    const signAndEncrypt = (attachment: Attachment) => {
        const signedContent = signContent(attachment.content, privateKey);
        const signedBuffer = base64ToBuffer(signedContent);
        const encryptedData = encrypt(signedBuffer, publicKey);
        const encryptedContent = bufferToBase64(encryptedData);
        return {
            ...attachment,
            content: encryptedContent,
        };
    };
    return attachments.map(signAndEncrypt);
}

export function decryptAndExtractAttachments(
    attachments: Attachment[],
    publicKey: string,
    privateKey: string,
) {
    const decryptAndExtract = (attachment: Attachment) => {
        const encryptedBuffer = base64ToBuffer(attachment.content);
        const decryptedBuffer = decrypt(encryptedBuffer, privateKey);
        const signedContent = bufferToBase64(decryptedBuffer);
        const extractedContent = extractSignedContent(signedContent, publicKey);
        return {
            ...attachment,
            content: extractedContent,
        };
    };
    return attachments.map(decryptAndExtract);
}
