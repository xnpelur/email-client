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
    TrashIcon,
    UserIcon,
} from "lucide-react";
import Link from "next/link";

type Props = {
    email: Email;
    mailbox: {
        label: string;
        url: string;
    };
};

export default function EmailView({ email, mailbox }: Props) {
    return (
        <Card className="flex h-full w-full flex-col border-none shadow-none">
            <CardHeader className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <Link
                        href={mailbox.url}
                        className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "gap-2 px-3",
                        )}
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        <span>{mailbox.label}</span>
                    </Link>
                    <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
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
                            <h2 className="text-xl font-semibold">
                                {email.subject}
                            </h2>
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
            <CardContent className="flex-1 space-y-6 overflow-auto pt-6">
                <div className="max-w-none">
                    {email.text.split("\n").map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>
                {email.attachments.length > 0 && (
                    <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm font-medium">
                            Прикрепленные файлы
                        </p>
                        {email.attachments.map((attachment, index) => (
                            <div
                                key={index}
                                className="mt-2 flex items-center space-x-2"
                            >
                                <div className="rounded bg-background p-2">
                                    <svg
                                        className="h-6 w-6 text-muted-foreground"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        {attachment.filename}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
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
        </Card>
    );
}

function ContactView({
    contact,
}: {
    contact: { name: string; address: string };
}) {
    return (
        <>
            {contact.name}{" "}
            <span className="font-normal">&lt;{contact.address}&gt;</span>
        </>
    );
}
