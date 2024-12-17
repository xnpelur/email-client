"use server";

import nodemailer from "nodemailer";
import { Email } from "@/types/email";
import { getSession } from "./auth";

export async function sendEmail(email: Email): Promise<boolean> {
    const session = await getSession();

    const transporter = nodemailer.createTransport({
        host: session!.user.smtpHost,
        port: 465,
        secure: true,
        auth: {
            user: session!.user.email,
            pass: session!.user.password,
        },
    });

    transporter.sendMail(
        {
            ...email,
            from: email.from.address,
            to: email.to.address,
            encoding: "base64",
            textEncoding: "base64",
            attachments: email.attachments.map((attachment) => ({
                ...attachment,
                encoding: "base64",
            })),
        },
        (error, info) => {
            if (error) {
                console.error(`Error: ${error}`);
                return false;
            }
        },
    );

    return true;
}
