import EmailsPage from "@/components/emailsPage";
import { getEmails } from "@/lib/imap";

export default async function SentPage() {
    const emails = await getEmails("Отправленные");

    return <EmailsPage emails={emails} title="Отправленные" />;
}
