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
    const lines = body.trim().split("\r\n");
    const finalState = lines.reduce(parseLine, []);

    const plainTextPart = finalState.find(
        (p) => p.contentType === "text/plain",
    );

    if (!plainTextPart) {
        return "";
    }

    return plainTextPart.contentTransferEncoding === "base64"
        ? Buffer.from(plainTextPart.content, "base64").toString("utf8")
        : plainTextPart.content;
}

type ParseState = {
    contentType: string;
    contentTransferEncoding: string;
    content: string;
    contentFlag: boolean;
};

const emptyPart = () => ({
    contentType: "",
    contentTransferEncoding: "",
    content: "",
    contentFlag: false,
});

const parseLine = (state: ParseState[], line: string): ParseState[] => {
    if (state.length === 0) {
        state.push(emptyPart());
    }

    const currentPart = state[state.length - 1];

    if (line.startsWith("--")) {
        if (currentPart.contentType) {
            state.push(emptyPart());
        }
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

    return state;
};
