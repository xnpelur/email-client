import EmailsPage from "@/components/emails-page";
import { getSentEmails } from "@/data/email";
import { getCurrentUser } from "@/data/user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
