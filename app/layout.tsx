import { Button } from "@/components/ui/button";
import {
    EnvelopeOpenIcon,
    PaperPlaneIcon,
    TrashIcon,
    FileTextIcon,
} from "@radix-ui/react-icons";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

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
                    <span className="text-xl font-semibold text-white">
                        My Mail
                    </span>
                    <Button className="w-full bg-violet-500">
                        Новое сообщение
                    </Button>
                    <div className="space-y-2">
                        <Button
                            variant="ghost"
                            className="flex h-9 w-full justify-start px-2 py-0 text-white"
                        >
                            <EnvelopeOpenIcon className="mr-2 h-4 w-4" />
                            <span>Входящие</span>
                        </Button>
                        <Button
                            variant="ghost"
                            className="flex h-9 w-full justify-start px-2 py-0 text-white"
                        >
                            <PaperPlaneIcon className="mr-2 h-4 w-4" />
                            <span>Отправленные</span>
                        </Button>
                        <Button
                            variant="ghost"
                            className="flex h-9 w-full justify-start px-2 py-0 text-white"
                        >
                            <FileTextIcon className="mr-2 h-4 w-4" />
                            <span>Черновики</span>
                        </Button>
                        <Button
                            variant="ghost"
                            className="flex h-9 w-full justify-start px-2 py-0 text-white"
                        >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            <span>Спам</span>
                        </Button>
                    </div>
                </aside>
                <main className="h-full w-10 flex-1">{children}</main>
            </body>
        </html>
    );
}
