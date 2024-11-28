import { PaperclipIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Attachment } from "@/types/email";

interface FilePickerProps {
    attachments: Attachment[];
    setAttachments: (attachments: Attachment[]) => void;
}

export function FilePicker({ attachments, setAttachments }: FilePickerProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newFiles = event.target.files;

        const newAttachments = await Promise.all(
            Array.from(newFiles ?? []).map(async (file) => ({
                filename: file.name,
                content: Buffer.from(await file.arrayBuffer()),
            })),
        );

        if (newAttachments.length > 0) {
            const updatedAttachments = [...attachments, ...newAttachments];

            setAttachments(updatedAttachments);

            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => inputRef.current?.click()}
            >
                <PaperclipIcon className="h-4 w-4" />
            </Button>
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                multiple
            />
        </>
    );
}
