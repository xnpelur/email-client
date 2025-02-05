"use server";

import * as imap from "@/lib/imap";
import * as smtp from "@/lib/smtp";
import { Email } from "@/types/email";
import { getSession } from "@/lib/auth";
import { User } from "@/types/auth";
import { getPublicKey, getPrivateKey } from "@/data/keys";
import {
    signAndEncryptText,
    signAndEncryptAttachments,
    decryptAndExtractText,
    decryptAndExtractAttachments,
} from "@/lib/sign-encrypt";

export async function getEmails(
    mailbox: keyof User["mailboxes"],
): Promise<Email[]> {
    return imap.getEmails(mailbox);
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
    const publicKey = await getPublicKey(email.from.address);

    if (!publicKey || !privateKey) {
        return email;
    }

    try {
        return {
            ...email,
            text: decryptAndExtractText(email.text, publicKey, privateKey),
            attachments: decryptAndExtractAttachments(
                email.attachments,
                publicKey,
                privateKey,
            ),
            encrypted: true,
        };
    } catch (error) {
        console.error(error);
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
            content: filesBase64[i],
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
    const senderPrivateKey = await getPrivateKey(
        session.user.email,
        session.user.password,
    );

    let success = false;

    if (receiverPublicKey && senderPrivateKey) {
        const encryptedEmail = {
            ...email,
            text: signAndEncryptText(
                email.text,
                receiverPublicKey,
                senderPrivateKey,
            ),
            attachments: signAndEncryptAttachments(
                email.attachments,
                receiverPublicKey,
                senderPrivateKey,
            ),
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
    const session = await getSession();
    if (!session?.user) {
        return;
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
            content: filesBase64[i],
        });
    }

    const email: Email = {
        seqNo,
        from: { name: "", address: session.user.email },
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

    const publicKey = await getPublicKey(session.user.email);
    const privateKey = await getPrivateKey(
        session.user.email,
        session.user.password,
    );

    if (!publicKey || !privateKey) {
        return;
    }

    const encryptedEmail = {
        ...email,
        text: signAndEncryptText(email.text, publicKey, privateKey),
        attachments: signAndEncryptAttachments(
            email.attachments,
            publicKey,
            privateKey,
        ),
        encrypted: true,
    };

    await imap.saveToMailbox(encryptedEmail, mailbox, ["\\Seen"]);
}
