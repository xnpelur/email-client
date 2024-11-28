import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getMailboxLabel(mailboxUrl: string): string {
    switch (mailboxUrl) {
        case "/inbox":
            return "INBOX";
        case "/sent":
            return "Отправленные";
        case "/trash":
            return "Корзина";
        case "/drafts":
            return "Черновики";
        default:
            return mailboxUrl;
    }
}

export function bufferToBase64(buffer: Buffer): string {
    return Buffer.from(buffer).toString("base64");
}

export function base64ToBuffer(base64: string): Buffer {
    return Buffer.from(base64, "base64");
}
