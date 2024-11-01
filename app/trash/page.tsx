import EmailsPage from "@/components/emailsPage";
import { getEmails } from "@/lib/imap";

export default async function TrashPage() {
    const emails = await getEmails("Корзина");

    return <EmailsPage emails={emails} title="Корзина" />;
}
