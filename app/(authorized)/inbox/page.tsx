import { EmailsPage } from "@/components/emails-page";
import { getEmails } from "@/data/email";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InboxPage() {
    const emails = await getEmails("inbox");

    return <EmailsPage emails={emails} title="Входящие" url="/inbox" />;
}
