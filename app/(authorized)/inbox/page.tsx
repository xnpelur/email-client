import { EmailsPage } from "@/components/emails-page";
import { getInboxEmails } from "@/data/email";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InboxPage() {
    const emails = await getInboxEmails();

    return <EmailsPage emails={emails} title="Входящие" url="/inbox" />;
}
