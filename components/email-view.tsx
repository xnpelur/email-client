"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Email } from "@/types/email";
import {
    ArrowLeftIcon,
    ReplyIcon,
    ForwardIcon,
    UserIcon,
    ArchiveRestoreIcon,
} from "lucide-react";
import Link from "next/link";
import { AttachmentView } from "@/components/attachment-view";
import { TrashIcon } from "lucide-react";
import { deleteEmail } from "@/data/email";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/types/auth";
import { Badge } from "./ui/badge";

type Props = {
    email: Email;
    mailbox: keyof User["mailboxes"];
    previousPageTitle: string;
};

export default function EmailView({
    email,
    mailbox,
    previousPageTitle: mailboxLabel,
}: Props) {
    const router = useRouter();
    const pathname = usePathname();

    const handleDelete = async () => {
        await deleteEmail(mailbox, email);

        router.push(pathname.split("/").slice(0, -1).join("/"));
    };

    return (
        <div className="h-full w-full p-4">
            <Card className="flex h-full w-full flex-col border-none shadow-none">
                <CardHeader className="flex flex-col space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href={`/${mailbox}`}
                            className={cn(
                                buttonVariants({ variant: "ghost" }),
                                "gap-2 px-3",
                            )}
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            <span>{mailboxLabel}</span>
                        </Link>
                        <div className="flex space-x-2">
                            {mailbox === "trash" && (
                                <Button variant="ghost" size="icon">
                                    <ArchiveRestoreIcon className="h-4 w-4" />
                                    <span className="sr-only">Restore</span>
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleDelete}
                            >
                                <TrashIcon className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback>
                                <UserIcon className="h-6 w-6" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-semibold">
                                        {email.subject}
                                    </h2>
                                    {mailbox === "inbox" &&
                                        (email.encrypted ? (
                                            <Badge className="bg-green-600 hover:bg-green-700">
                                                Защищено
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-red-600 hover:bg-red-700">
                                                Не защищено
                                            </Badge>
                                        ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {email.date.toLocaleDateString("ru", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                            <p className="text-sm font-medium">
                                <ContactView contact={email.from} />
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Кому: <ContactView contact={email.to} />
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="flex-1 space-y-6 overflow-auto pt-4">
                    <div className="max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: email.text }} />
                    </div>
                    {email.attachments.length > 0 && (
                        <div className="space-y-2 rounded-lg bg-muted p-4">
                            <p className="text-sm font-medium">
                                Прикрепленные файлы
                            </p>
                            {email.attachments.map((attachment, index) => (
                                <AttachmentView
                                    key={index}
                                    attachment={attachment}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
                {mailbox !== "trash" && (
                    <>
                        <Separator />
                        <div className="flex justify-start space-x-2 p-4">
                            <Button variant="outline">
                                <ReplyIcon className="mr-2 h-4 w-4" />
                                Ответить
                            </Button>
                            <Button variant="outline">
                                <ForwardIcon className="mr-2 h-4 w-4" />
                                Переслать
                            </Button>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}

function ContactView({
    contact,
}: {
    contact: { name: string; address: string };
}) {
    if (contact.name.length === 0) {
        return <span className="font-normal">{contact.address}</span>;
    }

    return (
        <>
            {contact.name}{" "}
            <span className="font-normal">&lt;{contact.address}&gt;</span>
        </>
    );
}
