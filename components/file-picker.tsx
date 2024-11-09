import { PaperclipIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface FilePickerProps {
    files: File[];
    setFiles: (files: File[]) => void;
}

export function FilePicker({ files, setFiles }: FilePickerProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = event.target.files;
        if (newFiles) {
            const newFilesArray = Array.from(newFiles);
            const updatedFiles = [...files, ...newFilesArray];

            setFiles(updatedFiles);

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
