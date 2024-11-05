import { PaperclipIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface FilePickerProps {
    onFilesSelected: (files: File[]) => void;
}

export function FilePicker({ onFilesSelected }: FilePickerProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            onFilesSelected(Array.from(files));
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
                name="files"
            />
        </>
    );
}
