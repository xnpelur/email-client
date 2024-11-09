"use server";

import { Email } from "@/types/email";
import * as imap from "@/lib/imap";
import * as smtp from "@/lib/smtp";

export async function getInboxEmails(): Promise<Email[]> {
    const emails = await imap.getEmails("INBOX");
    return emails;
}

export async function getSentEmails(): Promise<Email[]> {
    const emails = await imap.getEmails("Отправленные");
    return emails;
}

export async function getDraftEmails(): Promise<Email[]> {
    return [];
}

export async function getTrashEmails(): Promise<Email[]> {
    return [];
}

export async function sendEmail(formData: FormData): Promise<boolean> {
    const receiver = formData.get("receiver") as string;
    const subject = formData.get("subject") as string;
    const text = formData.get("text") as string;
    const files = formData.getAll("files") as File[];

    const email: Email = {
        seqNo: 0,
        from: { name: "", address: process.env.EMAIL_ADDRESS! },
        to: { name: "", address: receiver },
        subject,
        date: new Date(),
        text,
        attachments: await Promise.all(
            files.map(async (file) => ({
                filename: file.name,
                content: Buffer.from(await file.arrayBuffer()),
            })),
        ),
    };

    const success = await smtp.sendEmail(email);

    if (success) {
        await imap.saveToFolder(email, "Отправленные", ["\\Seen"]);
    }

    return success;
}

export async function getEmail(
    mailbox: string,
    sequenceNumber: number,
): Promise<Email> {
    const email = await imap.getEmailBySeqNo(mailbox, sequenceNumber);
    return email;
}
