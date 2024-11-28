"use client";

import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { logout } from "@/lib/login";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <Button
            variant="ghost"
            className="flex items-center justify-start text-slate-600 hover:bg-slate-200"
            onClick={handleLogout}
        >
            <LogOutIcon className="mr-2 h-4 w-4" />
            Выйти
        </Button>
    );
}
