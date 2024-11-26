import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, getMailboxLabel } from "@/lib/utils";
import { Email } from "@/types/email";
import { ArrowLeftIcon, ReplyIcon, ForwardIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { AttachmentView } from "./attachments-view";
import { DeleteEmailButton } from "./delete-email-button";

type Props = {
    email: Email;
    mailbox: {
        label: string;
        url: string;
    };
};

export default function EmailView({ email, mailbox }: Props) {
    return (
        <div className="h-full w-full p-4">
            <Card className="flex h-full w-full flex-col border-none shadow-none">
                <CardHeader className="flex flex-col space-y-4 pt-4">
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
                            <DeleteEmailButton
                                mailbox={getMailboxLabel(mailbox.url)}
                                email={email}
                            />
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
                                <AttachmentView
                                    key={index}
                                    attachment={{
                                        filename: attachment.filename,
                                        contentBase64:
                                            attachment.content.toString(
                                                "base64",
                                            ),
                                    }}
                                />
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
        </div>
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
