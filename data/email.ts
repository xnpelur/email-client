"use server";

import { Email } from "@/types/email";
import * as imap from "@/lib/imap";
import * as smtp from "@/lib/smtp";
import { base64ToBuffer } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { User } from "@/types/auth";
import { encrypt, decrypt } from "@/lib/encryption";
import { getPublicKey, getPrivateKey } from "@/data/keys";

export async function getEmails(
    mailbox: keyof User["mailboxes"],
): Promise<Email[]> {
    const session = await getSession();
    if (!session) return [];

    const emails = await imap.getEmails(mailbox);

    const privateKey = await getPrivateKey(
        session.user.email,
        session.user.password,
    );
    if (!privateKey) return emails;

    const decryptedEmails = await Promise.all(
        emails.map(async (email) => {
            try {
                const decryptedText = decrypt(
                    Buffer.from(email.text, "base64"),
                    privateKey,
                ).toString();

                const decryptedAttachments = await Promise.all(
                    (email.attachments || []).map(async (attachment) => ({
                        ...attachment,
                        content: decrypt(attachment.content, privateKey),
                    })),
                );

                return {
                    ...email,
                    text: decryptedText,
                    attachments: decryptedAttachments,
                    encrypted: true,
                };
            } catch (error) {
                return email;
            }
        }),
    );

    return decryptedEmails;
}

export async function getEmail(
    mailbox: keyof User["mailboxes"],
    sequenceNumber: number,
): Promise<Email> {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const email = await imap.getEmailBySeqNo(mailbox, sequenceNumber);

    const privateKey = await getPrivateKey(
        session.user.email,
        session.user.password,
    );
    if (!privateKey) return email;

    try {
        const decryptedText = decrypt(
            Buffer.from(email.text, "base64"),
            privateKey,
        ).toString();

        const decryptedAttachments = await Promise.all(
            (email.attachments || []).map(async (attachment) => ({
                ...attachment,
                content: decrypt(attachment.content, privateKey),
            })),
        );

        return {
            ...email,
            text: decryptedText,
            attachments: decryptedAttachments,
            encrypted: true,
        };
    } catch (error) {
        return email;
    }
}

export async function sendEmail(
    formData: FormData,
    draftSeqNo?: number,
): Promise<boolean> {
    const session = await getSession();
    if (!session) {
        return false;
    }

    const receiver = formData.get("receiver") as string;
    const subject = formData.get("subject") as string;
    const text = formData.get("text") as string;

    const filenames = formData.getAll("files-name") as string[];
    const filesBase64 = formData.getAll("files-base64") as string[];

    const attachments = [];
    for (let i = 0; i < filenames.length; i++) {
        attachments.push({
            filename: filenames[i],
            content: base64ToBuffer(filesBase64[i]),
        });
    }

    const email: Email = {
        seqNo: 0,
        from: { name: "", address: session.user.email },
        to: { name: "", address: receiver },
        subject,
        date: new Date(),
        text,
        attachments,
        encrypted: false,
    };

    const receiverPublicKey = await getPublicKey(receiver);
    let success = false;

    if (receiverPublicKey) {
        const encryptedText = encrypt(
            Buffer.from(text),
            receiverPublicKey,
        ).toString("base64");
        const encryptedAttachments = attachments.map((attachment) => ({
            ...attachment,
            content: encrypt(attachment.content, receiverPublicKey),
        }));

        const encryptedEmail = {
            ...email,
            text: encryptedText,
            attachments: encryptedAttachments,
            encrypted: true,
        };

        success = await smtp.sendEmail(encryptedEmail);
    } else {
        success = await smtp.sendEmail(email);
    }

    if (success) {
        await saveToMailboxEncrypted(email, "sent");
        if (draftSeqNo) {
            await imap.deleteEmail("drafts", draftSeqNo);
        }
    }

    return success;
}

export async function deleteEmail(
    mailbox: keyof User["mailboxes"],
    email: Email,
): Promise<void> {
    if (mailbox !== "trash") {
        await saveToMailboxEncrypted(email, "trash");
    }
    await imap.deleteEmail(mailbox, email.seqNo);
}

export async function saveDraft(
    formData: FormData,
    seqNo: number,
): Promise<void> {
    const receiver = formData.get("receiver") as string;
    const subject = formData.get("subject") as string;
    const text = formData.get("text") as string;

    const filenames = formData.getAll("files-name") as string[];
    const filesBase64 = formData.getAll("files-base64") as string[];

    const attachments = [];
    for (let i = 0; i < filenames.length; i++) {
        attachments.push({
            filename: filenames[i],
            content: base64ToBuffer(filesBase64[i]),
        });
    }

    const email: Email = {
        seqNo,
        from: { name: "", address: "" },
        to: { name: "", address: receiver },
        subject,
        date: new Date(),
        text,
        attachments,
        encrypted: false,
    };

    if (email.seqNo !== 0) {
        await imap.deleteEmail("drafts", email.seqNo);
    }
    await saveToMailboxEncrypted(email, "drafts");
}

async function saveToMailboxEncrypted(
    email: Email,
    mailbox: keyof User["mailboxes"],
): Promise<void> {
    const session = await getSession();
    if (!session) {
        return;
    }

    const receiverPublicKey = await getPublicKey(session.user.email);
    if (!receiverPublicKey) return;

    const encryptedText = encrypt(
        Buffer.from(email.text),
        receiverPublicKey,
    ).toString("base64");

    const encryptedAttachments = email.attachments.map((attachment) => ({
        ...attachment,
        content: encrypt(attachment.content, receiverPublicKey),
    }));

    const encryptedEmail = {
        ...email,
        text: encryptedText,
        attachments: encryptedAttachments,
        encrypted: true,
    };

    await imap.saveToMailbox(encryptedEmail, mailbox, ["\\Seen"]);
}
