"use server";

import nodemailer from "nodemailer";
import { Email } from "@/types/email";

export async function sendEmail(email: Email): Promise<boolean> {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST!,
        port: parseInt(process.env.SMTP_PORT!),
        secure: true,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    transporter.sendMail(
        {
            ...email,
            from: email.from.address,
            to: email.to.address,
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
