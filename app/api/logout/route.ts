import { logout } from "@/lib/login";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    await logout();
    return NextResponse.redirect(request.url);
}
