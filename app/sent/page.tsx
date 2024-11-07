import EmailsPage from "@/components/emailsPage";
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
