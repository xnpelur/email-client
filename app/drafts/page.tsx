import EmailsPage from "@/components/emailsPage";
import { getDraftEmails } from "@/lib/email";
import { getCurrentUser } from "@/lib/user";

export default async function DraftsPage() {
    const emails = await getDraftEmails();

    return (
        <EmailsPage emails={emails} title="Черновики" user={getCurrentUser()} />
    );
}
