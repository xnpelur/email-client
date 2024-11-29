import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Email Client",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html>
            <body className={cn(inter.className, "flex bg-slate-100")}>
                {children}
            </body>
        </html>
    );
}
