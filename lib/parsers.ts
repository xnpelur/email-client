import { Attachment } from "@/types/email";
import { base64ToBuffer } from "./utils";

type Contact = {
    name: string;
    address: string;
};

type BodyParseResult = {
    plain: string;
    html: string;
    attachments: Attachment[];
};

type BodyParseState = {
    contentType: string;
    contentTransferEncoding: string;
    content: string;
    contentFlag: boolean;
    contentDisposition: string;
    filename: string;
};

export function parseContact(contact: string): Contact {
    const match = contact.match(/^(.*?)\s<(.+)>$/);

    if (!match) {
        return { name: "", address: contact };
    }

    const name = match[1] || "";
    const address = match[2] || "";

    return { name, address };
}

export function parseBody(body: string): BodyParseResult {
    const lines = body.trim().split("\r\n");
    const finalState = lines.reduce(parseLine, []);
    const result: BodyParseResult = {
        plain: "",
        html: "",
        attachments: [],
    };

    for (const part of finalState) {
        if (part.contentDisposition === "attachment") {
            if (part.contentTransferEncoding === "base64") {
                const filename = decodeBase64Mime(part.filename);

                result.attachments.push({
                    content: part.content,
                    filename,
                });
            }
        } else if (part.contentType === "text/plain") {
            const content =
                part.contentTransferEncoding === "base64"
                    ? decodeBase64(part.content)
                    : part.content;

            result.plain = content;
        } else if (part.contentType === "text/html") {
            const content =
                part.contentTransferEncoding === "base64"
                    ? decodeBase64(part.content)
                    : part.content;

            result.html = content;
        }
    }

    return result;
}

function parseLine(state: BodyParseState[], line: string): BodyParseState[] {
    if (state.length === 0) {
        state.push(emptyState());
    }

    const currentPart = state[state.length - 1];

    if (line.startsWith("--")) {
        state.push(emptyState());
        return state;
    }

    if (currentPart.contentFlag) {
        currentPart.content += line;
        return state;
    }

    if (line.length === 0) {
        currentPart.contentFlag = true;
        return state;
    }

    if (line.startsWith("Content-Type:")) {
        currentPart.contentType = line.split(";")[0].split(":")[1].trim();
        return state;
    }

    if (line.startsWith("Content-Transfer-Encoding:")) {
        currentPart.contentTransferEncoding = line.split(":")[1].trim();
        return state;
    }

    if (line.startsWith("Content-Disposition:")) {
        currentPart.contentDisposition = line
            .split(";")[0]
            .split(":")[1]
            .trim();

        if (currentPart.contentDisposition === "attachment") {
            currentPart.filename = line.split("filename=")[1].replace(/"/g, "");
        }

        return state;
    }

    return state;
}

function emptyState(): BodyParseState {
    return {
        contentType: "",
        contentTransferEncoding: "",
        contentDisposition: "",
        content: "",
        contentFlag: false,
        filename: "",
    };
}

function decodeBase64(encodedWord: string) {
    return base64ToBuffer(encodedWord).toString("utf8");
}

function decodeBase64Mime(encodedWord: string) {
    const parts = encodedWord.split("?");

    if (parts.length !== 5 || parts[0] !== "=" || parts[4] !== "=") {
        return encodedWord;
    }

    const charset = parts[1];
    const encoding = parts[2].toUpperCase();
    const encodedText = parts[3];

    if (encoding !== "B") {
        return encodedWord;
    }

    const decodedText = base64ToBuffer(encodedText).toString(
        charset as BufferEncoding,
    );

    return decodedText;
}
