"use client";

import { useState } from "react";
import { Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function NewMessageDialog() {
    const [isOpen, setIsOpen] = useState(false);

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
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between bg-violet-100 p-3">
                        <h3 className="font-semibold">Новое сообщение</h3>
                    </div>

                    <div className="flex-grow space-y-4 overflow-auto p-4">
                        <div>
                            <Input
                                type="email"
                                placeholder="Кому"
                                className="rounded-none border-0 border-b px-0 focus-visible:ring-0"
                            />
                        </div>
                        <div>
                            <Input
                                type="text"
                                placeholder="Тема"
                                className="rounded-none border-0 border-b px-0 focus-visible:ring-0"
                            />
                        </div>
                        <Textarea
                            placeholder="Ваше сообщение..."
                            className="min-h-[300px] resize-none border-0 px-0 focus-visible:ring-0"
                        />
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t p-3">
                        <Button className="bg-violet-600 hover:bg-violet-700">
                            <Send className="mr-2 h-4 w-4" />
                            Отправить
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
