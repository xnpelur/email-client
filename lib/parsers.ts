type Contact = {
    name: string;
    address: string;
};

type BodyPart = {
    type: "plain" | "html" | "attachment";
    content: string;
    filename?: string;
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

export function parseBody(body: string): BodyPart[] {
    const lines = body.trim().split("\r\n");
    const finalState = lines.reduce(parseLine, []);
    const bodyParts: BodyPart[] = [];

    for (const part of finalState) {
        if (part.contentDisposition === "attachment") {
            if (part.contentTransferEncoding === "base64") {
                const content = decodeBase64(part.content);
                const filename = decodeBase64Mime(part.filename);

                bodyParts.push({
                    type: "attachment",
                    content,
                    filename,
                });
            }
        } else if (part.contentType === "text/plain") {
            const content =
                part.contentTransferEncoding === "base64"
                    ? decodeBase64(part.content)
                    : part.content;

            bodyParts.push({ type: "plain", content });
        } else if (part.contentType === "text/html") {
            const content =
                part.contentTransferEncoding === "base64"
                    ? decodeBase64(part.content)
                    : part.content;

            bodyParts.push({ type: "html", content });
        }
    }

    return bodyParts;
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
            currentPart.filename = line.split("filename=")[1].slice(1, -1);
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
    return Buffer.from(encodedWord, "base64").toString("utf8");
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

    const buffer = Buffer.from(encodedText, "base64");
    const decodedText = buffer.toString(charset as BufferEncoding);

    return decodedText;
}
