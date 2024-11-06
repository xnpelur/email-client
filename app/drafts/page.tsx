import EmailsPage from "@/components/emailsPage";
import { getDraftEmails } from "@/data/email";
import { getCurrentUser } from "@/data/user";

export default async function DraftsPage() {
    const emails = await getDraftEmails();

    return (
        <EmailsPage emails={emails} title="Черновики" user={getCurrentUser()} />
    );
}
