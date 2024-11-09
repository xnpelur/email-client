import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import NewEmailDialog from "@/components/new-email-dialog";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "My Mail",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html>
            <body className={cn(inter.className, "flex")}>
                <aside className="h-full w-64 space-y-4 bg-violet-800 p-4">
                    <div className="h-10">
                        <span className="text-2xl font-semibold text-white">
                            My Mail
                        </span>
                    </div>
                    <NewEmailDialog />
                    <Navbar />
                </aside>
                <main className="h-full w-10 flex-1">{children}</main>
            </body>
        </html>
    );
}
