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

export function stringToBase64(string: string): string {
    return Buffer.from(string).toString("base64");
}

export function base64ToString(base64: string): string {
    return Buffer.from(base64, "base64").toString();
}

export function stringToBuffer(string: string): Buffer {
    return Buffer.from(string);
}

export function bufferToString(buffer: Buffer): string {
    return Buffer.from(buffer).toString();
}
