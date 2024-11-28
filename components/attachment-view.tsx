"use client";

import { FileIcon } from "lucide-react";

export function AttachmentView({
    attachment,
}: {
    attachment: { filename: string; contentBase64: string };
}) {
    const getDownloadUrl = (contentBase64: string) => {
        return "";
        const byteCharacters = atob(contentBase64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays);

        return URL.createObjectURL(blob);
    };

    return (
        <div className="flex items-center space-x-2">
            <FileIcon className="h-6 w-6 text-muted-foreground" />
            <div>
                <a
                    href={getDownloadUrl(attachment.contentBase64)}
                    download={attachment.filename}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    {attachment.filename}
                </a>
            </div>
        </div>
    );
}
