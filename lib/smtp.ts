"use server";

import nodemailer from "nodemailer";

export async function sendEmail(
    to: string,
    subject: string,
    text: string,
): Promise<boolean> {
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
            from: process.env.EMAIL_ADDRESS,
            to,
            subject,
            text,
        },
        (error, info) => {
            if (error) {
                console.log(`Error: ${error}`);
                return false;
            }
            console.log(`Email sent: ${info.response}`);
        },
    );

    return true;
}
