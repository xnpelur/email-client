import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import NewEmailDialog from "@/components/new-email-dialog";
import { LogOutIcon, UserCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                <aside className="flex h-full w-64 flex-col justify-between p-4 pt-8">
                    <div className="space-y-4">
                        <div className="flex h-10 items-center gap-2">
                            <div className="h-6 w-6">
                                <UserCircleIcon className="text-slate-600" />
                            </div>
                            <span className="truncate pb-1 text-base font-semibold text-slate-600">
                                a_bbbbb_c@example.com
                            </span>
                        </div>
                        <NewEmailDialog />
                        <Navbar />
                    </div>
                    <Button
                        variant="ghost"
                        className="flex items-center justify-start text-slate-600 hover:bg-slate-200"
                    >
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        Выйти
                    </Button>
                </aside>
                <main className="h-full w-10 flex-1">{children}</main>
            </body>
        </html>
    );
}
