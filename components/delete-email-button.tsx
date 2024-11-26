"use client";

import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteEmail } from "@/data/email";
import { usePathname, useRouter } from "next/navigation";
import { Email } from "@/types/email";

type Props = {
    mailbox: string;
    email: Email;
};

export function DeleteEmailButton({ mailbox, email }: Props) {
    const router = useRouter();
    const pathname = usePathname();

    const handleDelete = async () => {
        await deleteEmail(mailbox, email);

        router.push(pathname.split("/").slice(0, -1).join("/"));
    };

    return (
        <Button variant="ghost" size="icon" onClick={handleDelete}>
            <TrashIcon className="h-4 w-4" />
            <span className="sr-only">Delete</span>
        </Button>
    );
}
