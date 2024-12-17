"use client";

import { base64ToBuffer } from "@/lib/utils";
import { Attachment } from "@/types/email";
import { FileIcon } from "lucide-react";
import { useState, useEffect } from "react";

export function AttachmentView({ attachment }: { attachment: Attachment }) {
    const [downloadUrl, setDownloadUrl] = useState<string>("");

    useEffect(() => {
        const buffer = base64ToBuffer(attachment.content);
        const blob = new Blob([buffer]);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [attachment.content]);

    return (
        <div className="flex items-center space-x-2">
            <FileIcon className="h-6 w-6 text-muted-foreground" />
            {downloadUrl && (
                <a
                    href={downloadUrl}
                    download={attachment.filename}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    {attachment.filename}
                </a>
            )}
        </div>
    );
}
