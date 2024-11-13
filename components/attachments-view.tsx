"use client";

export function AttachmentView({
    attachment,
}: {
    attachment: { filename: string; contentBase64: string };
}) {
    const getDownloadUrl = (contentBase64: string) => {
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
        <div className="mt-2 flex items-center space-x-2">
            <div className="rounded bg-background p-2">
                <svg
                    className="h-6 w-6 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                </svg>
            </div>
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
