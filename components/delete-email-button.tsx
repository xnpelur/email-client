"use client";

import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteEmail } from "@/data/email";
import { usePathname, useRouter } from "next/navigation";

type Props = {
    mailbox: string;
    sequenceNumber: number;
};

export function DeleteEmailButton({ mailbox, sequenceNumber }: Props) {
    const router = useRouter();
    const pathname = usePathname();

    const handleDelete = async () => {
        await deleteEmail(mailbox, sequenceNumber);

        router.push(pathname.split("/").slice(0, -1).join("/"));
    };

    return (
        <Button variant="ghost" size="icon" onClick={handleDelete}>
            <TrashIcon className="h-4 w-4" />
            <span className="sr-only">Delete</span>
        </Button>
    );
}
