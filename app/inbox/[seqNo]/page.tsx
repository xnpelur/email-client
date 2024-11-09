import EmailView from "@/components/email-view";
import { getEmailBySeqNo } from "@/lib/imap";

export default async function EmailPage({
    params,
}: {
    params: { seqNo: string };
}) {
    const email = await getEmailBySeqNo("INBOX", parseInt(params.seqNo));

    return <EmailView email={email} />;
}
