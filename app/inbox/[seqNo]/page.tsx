import { getEmailBySeqNo } from "@/lib/imap";

export default async function EmailPage({
    params,
}: {
    params: { seqNo: string };
}) {
    const email = await getEmailBySeqNo("INBOX", parseInt(params.seqNo));

    return (
        <div className="p-4">
            <pre>
                {JSON.stringify(
                    {
                        seqNo: email.seqNo,
                        from: email.from,
                        to: email.to,
                        subject: email.subject,
                        date: email.date.toISOString(),
                        text: email.text,
                        attachments: email.attachments,
                    },
                    null,
                    2,
                )}
            </pre>
        </div>
    );
}
