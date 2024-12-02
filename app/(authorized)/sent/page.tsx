import { EmailsPage } from "@/components/emails-page";
import { getEmails } from "@/data/email";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SentPage() {
    const emails = await getEmails("sent");

    return <EmailsPage emails={emails} title="Отправленные" url="/sent" />;
}
