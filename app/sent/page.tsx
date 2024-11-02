import EmailsPage from "@/components/emailsPage";
import { getEmails } from "@/lib/imap";
import { getCurrentUser } from "@/lib/user";

export default async function SentPage() {
    const emails = await getEmails("Отправленные");

    return (
        <EmailsPage
            emails={emails}
            title="Отправленные"
            user={getCurrentUser()}
        />
    );
}
