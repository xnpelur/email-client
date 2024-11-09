import EmailView from "@/components/email-view";
import { getEmailBySeqNo } from "@/lib/imap";

export default async function EmailPage({
    params,
}: {
    params: { seqNo: string };
}) {
    const email = await getEmailBySeqNo("Отправленные", parseInt(params.seqNo));

    return (
        <EmailView
            email={email}
            mailbox={{ label: "Отправленные", url: "/sent" }}
        />
    );
}
