import EmailsPage from "@/components/emailsPage";
import { getSentEmails } from "@/lib/email";
import { getCurrentUser } from "@/lib/user";

export default async function SentPage() {
    const emails = await getSentEmails();

    return (
        <EmailsPage
            emails={emails}
            title="Отправленные"
            user={getCurrentUser()}
        />
    );
}
