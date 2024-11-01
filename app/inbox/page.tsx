import EmailsPage from "@/components/emailsPage";
import { getEmails } from "@/lib/imap";

export default async function InboxPage() {
    const emails = await getEmails("INBOX");

    return <EmailsPage emails={emails} title="Входящие" />;
}
