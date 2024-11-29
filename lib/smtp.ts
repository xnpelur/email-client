"use server";

import nodemailer from "nodemailer";
import { Email } from "@/types/email";
import { getSession } from "./auth";

export async function sendEmail(email: Email): Promise<boolean> {
    const session = await getSession();

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST!,
        port: parseInt(process.env.SMTP_PORT!),
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
