"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.AUTH_SECRET || !process.env.AUTH_EXPIRATION_TIME) {
    throw new Error("Auth secret is not set in .env");
}

const key = new TextEncoder().encode(process.env.AUTH_SECRET);

export type Session = {
    user: User;
};

export type User = {
    email: string;
    password: string;
};

export async function getSession(): Promise<Session | null> {
    const session = cookies().get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    const expirationTime = parseInt(process.env.AUTH_EXPIRATION_TIME!);
    parsed.expires = new Date(Date.now() + expirationTime * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: "session",
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });
    return res;
}

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${process.env.AUTH_EXPIRATION_TIME} sec from now`)
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}
