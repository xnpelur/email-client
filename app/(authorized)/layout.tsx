import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar/sidebar";

export default function AuthorizedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Sidebar />
            <main className="h-full flex-1">{children}</main>
        </>
    );
}
