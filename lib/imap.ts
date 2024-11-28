"use server";

import { Email } from "@/types/email";
import Imap from "imap";
import { parseContact, parseBody } from "@/lib/parsers";

const imapConfig: Imap.Config = {
    user: process.env.EMAIL_ADDRESS!,
    password: process.env.EMAIL_PASSWORD!,
    host: process.env.IMAP_HOST!,
    port: parseInt(process.env.IMAP_PORT!),
    tls: true,
};

export async function getEmails(mailboxPath: string): Promise<Email[]> {
    const client = new Imap(imapConfig);

    return new Promise((resolve, reject) => {
        const emails: Email[] = [];

        client.once("ready", () => {
            client.openBox(mailboxPath, false, (err, box) => {
                if (err) reject(err);

                const fetch = client.seq.fetch("1:*", {
                    bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)"],
                });

                fetch.on("message", (msg, seqNo) => {
                    msg.on("body", (stream) => {
                        let buffer = "";
                        stream.on("data", (chunk) => {
                            buffer += chunk.toString("utf8");
                        });

                        stream.once("end", () => {
                            const header = Imap.parseHeader(buffer);

                            const from = header.from?.[0];
                            const to = header.to?.[0];

                            emails.push({
                                seqNo,
                                from: parseContact(from),
                                to: parseContact(to),
                                subject: header.subject?.[0] || "",
                                date: new Date(header.date?.[0] || ""),
                                text: "",
                                attachments: [],
                            });
                        });
                    });
                });

                fetch.once("end", () => {
                    client.end();
                    resolve(emails.reverse());
                });
            });
        });

        client.once("error", (err: any) => {
            reject(err);
        });

        client.connect();
    });
}

export async function saveToMailbox(
    email: Email,
    mailbox: string,
    flags: string[],
): Promise<void> {
    const client = new Imap(imapConfig);

    return new Promise((resolve, reject) => {
        client.once("ready", () => {
            client.openBox(mailbox, true, (err, box) => {
                if (err) {
                    reject(err);
                    return;
                }

                const message = [
                    email.from.name.length > 0
                        ? `From: ${email.from.name} <${email.from.address}>`
                        : `From: ${email.from.address}`,
                    email.to.name.length > 0
                        ? `To: ${email.to.name} <${email.to.address}>`
                        : `To: ${email.to.address}`,
                    `Subject: ${email.subject}`,
                    `Date: ${email.date.toUTCString()}`,
                    `Content-Type: multipart/mixed; boundary="boundary"`,
                    "",
                    "--boundary",
                    "Content-Type: text/plain; charset=utf-8",
                    "",
                    email.text,
                    ...email.attachments.map((attachment) =>
                        [
                            "",
                            "--boundary",
                            `Content-Type: application/octet-stream; name="${attachment.filename}"`,
                            "Content-Transfer-Encoding: base64",
                            `Content-Disposition: attachment; filename="${attachment.filename}"`,
                            "",
                            attachment.content.toString("base64"),
                        ].join("\r\n"),
                    ),
                    "",
                    "--boundary--",
                ].join("\r\n");

                client.append(message, { mailbox, flags }, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                    client.end();
                });
            });
        });

        client.once("error", (err: any) => {
            reject(err);
        });

        client.connect();
    });
}

export async function getEmailBySeqNo(
    mailboxPath: string,
    seqNo: number,
): Promise<Email> {
    const client = new Imap(imapConfig);

    return new Promise((resolve, reject) => {
        client.once("ready", () => {
            client.openBox(mailboxPath, false, (err, box) => {
                if (err) reject(err);

                const fetch = client.seq.fetch(seqNo, {
                    bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "TEXT"],
                    struct: true,
                });

                fetch.on("message", (msg) => {
                    let headerBuffer = "";
                    let textBuffer = "";

                    msg.on("body", (stream, info) => {
                        let buffer = "";
                        stream.on("data", (chunk) => {
                            buffer += chunk.toString("utf8");
                        });

                        stream.once("end", () => {
                            if (info.which === "TEXT") {
                                textBuffer = buffer;
                            } else {
                                headerBuffer = buffer;
                            }

                            if (headerBuffer && textBuffer) {
                                const header = Imap.parseHeader(headerBuffer);

                                const from = header.from?.[0];
                                const to = header.to?.[0];

                                const bodyParseResult = parseBody(textBuffer);

                                resolve({
                                    seqNo,
                                    from: parseContact(from),
                                    to: parseContact(to),
                                    subject: header.subject?.[0] || "",
                                    date: new Date(header.date?.[0] || ""),
                                    text: bodyParseResult.plain,
                                    attachments: bodyParseResult.attachments,
                                });
                            }
                        });
                    });
                });

                fetch.once("end", () => {
                    client.end();
                });
            });
        });

        client.once("error", (err: any) => {
            reject(err);
        });

        client.connect();
    });
}

export async function deleteEmail(
    mailbox: string,
    seqNo: number,
): Promise<void> {
    const client = new Imap(imapConfig);

    return new Promise((resolve, reject) => {
        client.once("ready", () => {
            client.openBox(mailbox, false, (err) => {
                if (err) {
                    client.end();
                    reject(err);
                    return;
                }

                client.seq.addFlags(seqNo, "\\Deleted", (err) => {
                    if (err) {
                        client.end();
                        reject(err);
                        return;
                    }

                    client.expunge((err) => {
                        if (err) {
                            client.end();
                            reject(err);
                            return;
                        }

                        client.end();
                        resolve();
                    });
                });
            });
        });

        client.once("error", (err: any) => {
            reject(err);
        });

        client.connect();
    });
}

export async function testCredentials(
    username: string,
    password: string,
): Promise<boolean> {
    const client = new Imap({
        user: username,
        password: password,
        host: process.env.IMAP_HOST!,
        port: parseInt(process.env.IMAP_PORT!),
        tls: true,
    });

    return new Promise((resolve, reject) => {
        client.once("ready", () => {
            client.end();
            resolve(true);
        });

        client.once("error", (err: any) => {
            client.end();
            resolve(false);
        });

        client.connect();
    });
}
