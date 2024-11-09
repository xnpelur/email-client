import EmailsPage from "@/components/emails-page";
import { getSentEmails } from "@/data/email";
import { getCurrentUser } from "@/data/user";

export default async function SentPage() {
    const emails = await getSentEmails();

    return (
        <EmailsPage
            emails={emails}
            title="Отправленные"
            user={getCurrentUser()}
            url="/sent"
        />
    );
}
