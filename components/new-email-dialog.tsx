"use client";

import { useRef, useState } from "react";
import { Send, Trash2, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { deleteEmail, saveDraft, sendEmail } from "@/data/email";
import { FilePicker } from "@/components/file-picker";
import { Attachment, Email } from "@/types/email";
import { useRouter } from "next/navigation";
import { AttachmentView } from "@/components/attachment-view";
import { bufferToBase64 } from "@/lib/utils";

type Props = {
    email?: Email;
    hideTrigger?: boolean;
    onClose?: () => void;
};

export default function NewEmailDialog({ email, hideTrigger, onClose }: Props) {
    const [isOpen, setIsOpen] = useState(!!email);
    const formRef = useRef<HTMLFormElement>(null);
    const [attachments, setAttachments] = useState<Attachment[]>(
        email?.attachments ?? [],
    );
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        attachments.forEach((attachment) => {
            formData.append("files-name", attachment.filename);
            formData.append("files-base64", bufferToBase64(attachment.content));
        });

        const success = await sendEmail(formData, email?.seqNo);

        if (success) {
            setIsOpen(false);
            formRef.current?.reset();
            if (email) {
                router.refresh();
            }
        } else {
            console.error("Failed to send email");
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(value) => {
                if (!value) {
                    onClose?.();
                    const formData = new FormData(formRef.current!);
                    attachments.forEach((attachment) => {
                        formData.append("files-name", attachment.filename);
                        formData.append(
                            "files-base64",
                            bufferToBase64(attachment.content),
                        );
                    });

                    const receiver = formData.get("receiver");
                    const subject = formData.get("subject");
                    const text = formData.get("text");

                    const lastReceiver = email?.to.address ?? "";
                    const lastSubject = email?.subject ?? "";
                    const lastText = email?.text ?? "";
                    const attachmentsEqual =
                        attachments.length ===
                            (email?.attachments?.length ?? 0) &&
                        attachments.every(
                            (attachment, i) =>
                                attachment.filename ===
                                email?.attachments?.[i].filename,
                        );

                    if (
                        receiver !== lastReceiver ||
                        subject !== lastSubject ||
                        text !== lastText ||
                        !attachmentsEqual
                    ) {
                        saveDraft(formData, email?.seqNo ?? 0);
                    }
                    formRef.current?.reset();
                    setAttachments([]);
                }
                setIsOpen(value);
            }}
        >
            {!hideTrigger && (
                <DialogTrigger asChild>
                    <Button
                        className="w-full bg-slate-600 hover:bg-slate-700"
                        onClick={() => setIsOpen(true)}
                    >
                        Новое сообщение
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent
                className="fixed bottom-4 left-auto right-4 top-auto w-[500px] max-w-[calc(100vw-2rem)] translate-x-0 translate-y-0 p-0 shadow-xl data-[state=closed]:duration-0 data-[state=open]:duration-0"
                backgroundOpacity={0}
            >
                <DialogTitle className="sr-only">Новое сообщение</DialogTitle>
                <form
                    ref={formRef}
                    action={handleSubmit}
                    className="flex h-full flex-col"
                >
                    <div className="flex items-center justify-between bg-slate-100 p-3">
                        <h3 className="font-semibold">Новое сообщение</h3>
                    </div>

                    <div className="flex-grow overflow-auto px-4 py-1">
                        <Input
                            type="email"
                            name="receiver"
                            placeholder="Кому"
                            className="rounded-none border-0 border-b px-0 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                            defaultValue={email?.to.address}
                            required
                        />
                        <Input
                            type="text"
                            name="subject"
                            placeholder="Тема"
                            className="rounded-none border-0 border-b px-0 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                            defaultValue={email?.subject}
                            required
                        />
                        <div className="flex min-h-[300px] flex-col gap-2 pb-2">
                            <Textarea
                                name="text"
                                placeholder="Ваше сообщение..."
                                className="flex-1 resize-none border-0 px-0 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                                required
                                defaultValue={email?.text}
                            />
                            <div className="space-y-1">
                                {attachments.map((attachment, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-md border border-slate-300 bg-slate-100 px-2 py-1"
                                    >
                                        <AttachmentView
                                            attachment={{
                                                filename: attachment.filename,
                                                base64: bufferToBase64(
                                                    attachment.content,
                                                ),
                                            }}
                                        />
                                        <Button
                                            variant="ghost"
                                            className="h-5 w-5 p-0 hover:bg-slate-200"
                                            onClick={() =>
                                                setAttachments(
                                                    attachments.filter(
                                                        (_, i) => i !== index,
                                                    ),
                                                )
                                            }
                                        >
                                            <XIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t p-3">
                        <div className="space-x-2">
                            <Button
                                type="submit"
                                className="bg-slate-600 hover:bg-slate-700"
                            >
                                <Send className="mr-2 h-4 w-4" />
                                Отправить
                            </Button>
                            <FilePicker
                                attachments={attachments}
                                setAttachments={setAttachments}
                            />
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                formRef.current?.reset();
                                setAttachments([]);
                                setIsOpen(false);
                                if (email?.seqNo !== 0) {
                                    deleteEmail("Черновики", email!);
                                }
                                router.refresh();
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
