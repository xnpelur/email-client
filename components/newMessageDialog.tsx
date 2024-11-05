"use client";

import { useRef, useState } from "react";
import { Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { sendEmail } from "@/lib/smtp";
import { FilePicker } from "@/components/filePicker";

export default function NewMessageDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [files, setFiles] = useState<File[]>([]);

    const handleSubmit = async (formData: FormData) => {
        const success = await sendEmail(formData);
        if (success) {
            setIsOpen(false);
            formRef.current?.reset();
        } else {
            console.error("Failed to send email");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-full bg-violet-500"
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
                    <div className="flex items-center justify-between bg-violet-100 p-3">
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
                        <Textarea
                            name="text"
                            placeholder="Ваше сообщение..."
                            className="min-h-[300px] resize-none border-0 px-0 py-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                            required
                        />
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t p-3">
                        <div className="space-x-2">
                            <Button
                                type="submit"
                                className="bg-violet-600 hover:bg-violet-700"
                            >
                                <Send className="mr-2 h-4 w-4" />
                                Отправить
                            </Button>
                            <FilePicker onFilesSelected={setFiles} />
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
