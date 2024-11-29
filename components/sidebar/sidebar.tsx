import { UserCircleIcon } from "lucide-react";
import { NewEmailDialog } from "../new-email-dialog";
import { NavigationPanel } from "@/components/sidebar/navigation-panel";
import { getSession } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export async function Sidebar() {
    const session = await getSession();
    if (session === null) {
        throw new Error("Session is null");
    }

    return (
        <aside className="flex h-full w-64 flex-col justify-between p-4 pt-8">
            <div className="space-y-4">
                <div className="flex h-10 items-center gap-2">
                    <div className="h-6 w-6">
                        <UserCircleIcon className="text-slate-600" />
                    </div>
                    <span className="truncate pb-1 text-base font-semibold text-slate-600">
                        {session.user.email}
                    </span>
                </div>
                <NewEmailDialog />
                <NavigationPanel />
            </div>
            <Link
                href="/api/logout"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "flex items-center justify-start text-slate-600 hover:bg-slate-200",
                )}
            >
                <LogOutIcon className="mr-2 h-4 w-4" />
                Выйти
            </Link>
        </aside>
    );
}
