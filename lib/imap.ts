import { Email } from "@/types/email";
import Imap from "imap";

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

                            // Parses string formatted like "Name <email@example.com>"
                            const fromMatch = from.match(/^(.*?)\s<(.+)>$/);
                            const fromName = fromMatch?.[1] || "";
                            const fromEmail = fromMatch?.[2] || "";

                            emails.push({
                                from: {
                                    name: fromName,
                                    address: fromEmail,
                                },
                                to: {
                                    name: "",
                                    address: to,
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
