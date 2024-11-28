"use server";

import { testCredentials } from "./imap";
import { User, encrypt } from "./auth";
import { cookies } from "next/headers";

export async function login(email: string, password: string) {
    const result = await testCredentials(email, password);
    if (!result) {
        return false;
    }

    const user: User = { email, password };

    const expirationTime = parseInt(process.env.AUTH_EXPIRATION_TIME!);
    const expires = new Date(Date.now() + expirationTime * 1000);
    const session = await encrypt({ user, expires });

    cookies().set("session", session, { expires, httpOnly: true });
    return true;
}

export async function logout() {
    cookies().set("session", "", { expires: new Date(0) });
}
