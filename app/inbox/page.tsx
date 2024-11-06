import EmailsPage from "@/components/emailsPage";
import { getInboxEmails } from "@/lib/email";
import { getCurrentUser } from "@/lib/user";

export default async function InboxPage() {
    const emails = await getInboxEmails();

    return (
        <EmailsPage emails={emails} title="Входящие" user={getCurrentUser()} />
    );
}
