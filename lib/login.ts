"use server";

import { testCredentials } from "@/lib/imap";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { User } from "@/types/auth";
import { getProviderData } from "@/lib/providers";

export async function login(email: string, password: string) {
    const providerData = getProviderData(email);
    if (!providerData) {
        return false;
    }

    const result = await testCredentials(
        email,
        password,
        providerData.imapHost,
    );
    if (!result) {
        return false;
    }

    const user: User = { email, password, ...providerData };

    const expirationTime = parseInt(process.env.AUTH_EXPIRATION_TIME!);
    const expires = new Date(Date.now() + expirationTime * 1000);
    const session = await encrypt({ user, expires });

    cookies().set("session", session, { expires, httpOnly: true });
    return true;
}

export async function logout() {
    cookies().set("session", "", { expires: new Date(0) });
}
