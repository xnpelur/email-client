"use client";

import { useRef, useState } from "react";
import { Send, Trash2, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { saveDraft, sendEmail } from "@/data/email";
import { FilePicker } from "@/components/file-picker";

export default function NewEmailDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [files, setFiles] = useState<File[]>([]);

    const handleSubmit = async (formData: FormData) => {
        files.forEach((file) => {
            formData.append("files", file);
        });

        const success = await sendEmail(formData);

        if (success) {
            setIsOpen(false);
            formRef.current?.reset();
        } else {
            console.error("Failed to send email");
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(value) => {
                if (!value) {
                    const formData = new FormData(formRef.current!);

                    const receiver = formData.get("receiver") as string;
                    const subject = formData.get("subject") as string;
                    const text = formData.get("text") as string;

                    if (receiver && subject && text) {
                        const email = {
                            seqNo: 0,
                            from: { name: "", address: "me" },
                            to: {
                                name: "",
                                address: formData.get("receiver") as string,
                            },
                            subject: formData.get("subject") as string,
                            date: new Date(),
                            text: formData.get("text") as string,
                            attachments: [],
                        };
                        saveDraft(email);
                    }
                }
                setIsOpen(value);
            }}
        >
            <DialogTrigger asChild>
                <Button
                    className="w-full bg-slate-600 hover:bg-slate-700"
                    onClick={() => setIsOpen(true)}
                >
                    Новое сообщение
                </Button>
            </DialogTrigger>
            <DialogContent
                className="fixed bottom-4 left-auto right-4 top-auto w-[500px] max-w-[calc(100vw-2rem)] translate-x-0 translate-y-0 p-0 shadow-xl data-[state=closed]:duration-0 data-[state=open]:duration-0"
                backgroundOpacity={0}
            >
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
                            required
                        />
                        <Input
                            type="text"
                            name="subject"
                            placeholder="Тема"
                            className="rounded-none border-0 border-b px-0 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                            required
                        />
                        <div className="flex min-h-[300px] flex-col gap-2 pb-2">
                            <Textarea
                                name="text"
                                placeholder="Ваше сообщение..."
                                className="flex-1 resize-none border-0 px-0 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                                required
                            />
                            <div className="space-y-1">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-md bg-slate-200 px-2 py-1"
                                    >
                                        <span className="truncate text-sm">
                                            {file.name}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            className="h-5 w-5 p-0"
                                            onClick={() =>
                                                setFiles(
                                                    files.filter(
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
                            <FilePicker files={files} setFiles={setFiles} />
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => formRef.current?.reset()}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
