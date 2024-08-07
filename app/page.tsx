import { Button } from "@/components/ui/button";
import {
    EnvelopeOpenIcon,
    PaperPlaneIcon,
    TrashIcon,
    FileTextIcon,
} from "@radix-ui/react-icons";

export default function Home() {
    return (
        <main className="flex h-full">
            <div className="h-full w-64 space-y-4 bg-violet-800 p-4">
                <h1 className="text-xl font-semibold text-white">My Mail</h1>
                <Button className="w-full bg-violet-500">
                    Новое сообщение
                </Button>
                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        className="flex h-9 w-full justify-start px-2 py-0 text-white"
                    >
                        <EnvelopeOpenIcon className="mr-2 h-4 w-4" />
                        <span>Входящие</span>
                    </Button>
                    <Button
                        variant="ghost"
                        className="flex h-9 w-full justify-start px-2 py-0 text-white"
                    >
                        <PaperPlaneIcon className="mr-2 h-4 w-4" />
                        <span>Отправленные</span>
                    </Button>
                    <Button
                        variant="ghost"
                        className="flex h-9 w-full justify-start px-2 py-0 text-white"
                    >
                        <FileTextIcon className="mr-2 h-4 w-4" />
                        <span>Черновики</span>
                    </Button>
                    <Button
                        variant="ghost"
                        className="flex h-9 w-full justify-start px-2 py-0 text-white"
                    >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        <span>Спам</span>
                    </Button>
                </div>
            </div>
            <div className="h-full w-10 flex-1"></div>
        </main>
    );
}
