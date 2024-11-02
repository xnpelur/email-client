import EmailsPage from "@/components/emailsPage";
import { getEmails } from "@/lib/imap";
import { getCurrentUser } from "@/lib/user";

export default async function InboxPage() {
    const emails = await getEmails("INBOX");

    return (
        <EmailsPage emails={emails} title="Входящие" user={getCurrentUser()} />
    );
}
