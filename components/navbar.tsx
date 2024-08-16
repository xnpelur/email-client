"use client";

import { cn } from "@/lib/utils";
import {
    EnvelopeOpenIcon,
    FileTextIcon,
    PaperPlaneIcon,
    TrashIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
    return (
        <div>
            <NavLink icon={EnvelopeOpenIcon} label="Входящие" href="/inbox" />
            <NavLink icon={PaperPlaneIcon} label="Отправленные" href="/sent" />
            <NavLink icon={FileTextIcon} label="Черновики" href="/drafts" />
            <NavLink icon={TrashIcon} label="Спам" href="/spam" />
        </div>
    );
}

function NavLink({
    icon: Icon,
    label,
    href,
}: {
    icon: React.ElementType;
    label: string;
    href: string;
}) {
    const pathname = usePathname();
    return (
        <Link
            className={cn(
                "flex select-none items-center rounded-md px-3 py-2.5",
                "leading-none text-white no-underline outline-none transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                href === pathname ? "bg-accent/10 font-bold" : "",
            )}
            href={href}
        >
            <Icon className="mr-2 h-4 w-4" />
            <span
                className={cn(
                    "text-sm",
                    href === pathname ? "font-bold" : "font-medium",
                )}
            >
                {label}
            </span>
        </Link>
    );
}
