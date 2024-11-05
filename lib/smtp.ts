"use server";

import nodemailer from "nodemailer";

export async function sendEmail(formData: FormData): Promise<boolean> {
    const receiver = formData.get("receiver") as string;
    const subject = formData.get("subject") as string;
    const text = formData.get("text") as string;
    const files = formData.getAll("files") as File[];

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
            to: receiver,
            subject,
            text,
            attachments: await Promise.all(
                files.map(async (file) => ({
                    filename: file.name,
                    content: Buffer.from(await file.arrayBuffer()),
                })),
            ),
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
