import EmailsPage from "@/components/emails-page";
import { getInboxEmails } from "@/data/email";
import { getCurrentUser } from "@/data/user";

export default async function InboxPage() {
    const emails = await getInboxEmails();

    return (
        <EmailsPage
            emails={emails}
            title="Входящие"
            user={getCurrentUser()}
            url="/inbox"
        />
    );
}
