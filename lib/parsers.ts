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
    const lines = body.split("\r\n");

    let contentType = "";
    let contentTransferEncoding = "";
    let content = "";
    let contentFlag = false;

    for (const line of lines) {
        if (line.startsWith("--")) {
            if (contentType === "text/plain") {
                if (contentTransferEncoding === "base64") {
                    return Buffer.from(content, "base64").toString("utf8");
                }
                return content;
            }

            contentType = "";
            contentTransferEncoding = "";
            content = "";
            contentFlag = false;
            continue;
        }

        if (contentFlag) {
            content += line;
            continue;
        }

        if (line.length === 0) {
            contentFlag = true;
            continue;
        }

        if (line.startsWith("Content-Type:")) {
            const s = line.split(";")[0];
            contentType = s.split(":")[1].trim();
            continue;
        }

        if (line.startsWith("Content-Transfer-Encoding:")) {
            contentTransferEncoding = line.split(":")[1].trim();
            continue;
        }
    }

    return "";
}
