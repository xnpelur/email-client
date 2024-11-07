import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function parseContact(contact: string) {
    const match = contact.match(/^(.*?)\s<(.+)>$/);

    if (!match) {
        return { name: "", address: contact };
    }

    const name = match[1] || "";
    const address = match[2] || "";

    return { name, address };
}

export function parsePlainTextBody(body: string): string {
    const boundaryMatch = body.match(/--(.+?)\r\n/);
    if (!boundaryMatch) return "";

    const boundary = boundaryMatch[1];
    const parts = body.split(`--${boundary}`).map((part) => part.trim());

    for (const part of parts) {
        if (part.startsWith("Content-Type: text/plain")) {
            const content = part.split(
                "Content-Transfer-Encoding: base64\r\n\r\n",
            )[1];

            if (content) {
                return Buffer.from(content, "base64").toString("utf8");
            }
        }
    }

    return "";
}
