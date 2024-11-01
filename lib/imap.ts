import { Email } from "@/types/email";
import Imap from "imap";

const client = new Imap({
    user: process.env.EMAIL_ADDRESS!,
    password: process.env.EMAIL_PASSWORD!,
    host: process.env.EMAIL_HOST!,
    port: 993,
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
                            const from = header.from?.[0].match(
                                /(?:"([^"]*)")?\s*(?:<(.+)>)?/,
                            );
                            const to = header.to?.[0].match(
                                /(?:"([^"]*)")?\s*(?:<(.+)>)?/,
                            );

                            emails.push({
                                from: {
                                    name: from?.[1] || "",
                                    address:
                                        from?.[2] || header.from?.[0] || "",
                                },
                                to: {
                                    name: to?.[1] || "",
                                    address: to?.[2] || header.to?.[0] || "",
                                },
                                subject: header.subject?.[0] || "",
                                date: new Date(header.date?.[0] || ""),
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
