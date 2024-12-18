"use server";

import { Email } from "@/types/email";
import Imap from "imap";
import { parseContact, parseBody } from "@/lib/parsers";
import { getSession } from "./auth";
import { User } from "@/types/auth";

function getClient(user: User): Imap {
    return new Imap({
        user: user.email,
        password: user.password,
        host: user.imapHost,
        port: 993,
        tls: true,
    });
}

export async function getEmails(
    mailbox: keyof User["mailboxes"],
): Promise<Email[]> {
    const session = await getSession();
    const client = getClient(session!.user);

    return new Promise((resolve, reject) => {
        const emails: Email[] = [];

        client.once("ready", () => {
            client.openBox(
                session!.user.mailboxes[mailbox],
                false,
                (err, box) => {
                    if (err) reject(err);

                    const fetch = client.seq.fetch("1:*", {
                        bodies: "",
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
                                    encrypted: false,
                                });
                            });
                        });
                    });

                    fetch.once("end", () => {
                        client.end();
                        resolve(emails.reverse());
                    });
                },
            );
        });

        client.once("error", (err: any) => {
            reject(err);
        });

        client.connect();
    });
}

export async function saveToMailbox(
    email: Email,
    mailbox: keyof User["mailboxes"],
    flags: string[],
): Promise<void> {
    const session = await getSession();
    const client = getClient(session!.user);

    return new Promise((resolve, reject) => {
        client.once("ready", () => {
            client.openBox(session!.user.mailboxes[mailbox], true, (err) => {
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
                    "Content-Type: text/html; charset=utf-8",
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
                            attachment.content,
                        ].join("\r\n"),
                    ),
                    "",
                    "--boundary--",
                ].join("\r\n");

                client.append(
                    message,
                    { mailbox: session!.user.mailboxes[mailbox], flags },
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                        client.end();
                    },
                );
            });
        });

        client.once("error", (err: any) => {
            reject(err);
        });

        client.connect();
    });
}

export async function getEmailBySeqNo(
    mailbox: keyof User["mailboxes"],
    seqNo: number,
): Promise<Email> {
    const session = await getSession();
    const client = getClient(session!.user);

    return new Promise((resolve, reject) => {
        client.once("ready", () => {
            client.openBox(
                session!.user.mailboxes[mailbox],
                false,
                (err, box) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const fetch = client.seq.fetch(seqNo, {
                        bodies: "",
                    });

                    fetch.on("message", (msg) => {
                        let buffer = "";

                        msg.on("body", (stream) => {
                            stream.on("data", (chunk) => {
                                buffer += chunk.toString("utf8");
                            });

                            stream.once("end", () => {
                                const header = Imap.parseHeader(buffer);
                                const from = header.from?.[0];
                                const to = header.to?.[0];

                                const bodyParseResult = parseBody(buffer);

                                resolve({
                                    seqNo,
                                    from: parseContact(from),
                                    to: parseContact(to),
                                    subject: header.subject?.[0] || "",
                                    date: new Date(header.date?.[0] || ""),
                                    text: bodyParseResult.html,
                                    attachments: bodyParseResult.attachments,
                                    encrypted: false,
                                });
                            });
                        });
                    });

                    fetch.once("end", () => {
                        client.end();
                    });
                },
            );
        });

        client.once("error", (err: any) => {
            reject(err);
        });

        client.connect();
    });
}

export async function deleteEmail(
    mailbox: keyof User["mailboxes"],
    seqNo: number,
): Promise<void> {
    const session = await getSession();
    const client = getClient(session!.user);

    return new Promise((resolve, reject) => {
        client.once("ready", () => {
            client.openBox(session!.user.mailboxes[mailbox], false, (err) => {
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
    email: string,
    password: string,
    imapHost: string,
): Promise<boolean> {
    const client = new Imap({
        user: email,
        password: password,
        host: imapHost,
        port: 993,
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
