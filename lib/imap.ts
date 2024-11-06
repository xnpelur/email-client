import { Email } from "@/types/email";
import Imap from "imap";
import { parseContact } from "./utils";

const client = new Imap({
    user: process.env.EMAIL_ADDRESS!,
    password: process.env.EMAIL_PASSWORD!,
    host: process.env.IMAP_HOST!,
    port: parseInt(process.env.IMAP_PORT!),
    tls: true,
});

export function getEmails(mailboxPath: string): Promise<Email[]> {
    return new Promise((resolve, reject) => {
        const emails: Email[] = [];

        client.once("ready", () => {
            client.openBox(mailboxPath, false, (err, box) => {
                if (err) reject(err);

                const fetch = client.seq.fetch("1:*", {
                    bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)"],
                });

                fetch.on("message", (msg) => {
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

export function saveToFolder(
    email: Email,
    folder: string,
    flags: string[],
): Promise<void> {
    return new Promise((resolve, reject) => {
        client.once("ready", () => {
            client.openBox(folder, true, (err, box) => {
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

                client.append(message, { mailbox: box.name, flags }, (err) => {
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
