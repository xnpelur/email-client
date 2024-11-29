import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function bufferToBase64(buffer: Buffer): string {
    return Buffer.from(buffer).toString("base64");
}

export function base64ToBuffer(base64: string): Buffer {
    return Buffer.from(base64, "base64");
}
