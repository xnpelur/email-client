import EmailsPage from "@/components/emails-page";
import { getDraftEmails } from "@/data/email";
import { getCurrentUser } from "@/data/user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DraftsPage() {
    const emails = await getDraftEmails();

    return (
        <EmailsPage
            emails={emails}
            title="Черновики"
            user={getCurrentUser()}
            url="/drafts"
        />
    );
}
