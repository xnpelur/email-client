import { DraftEmailsPage } from "@/components/draft-emails-page";
import { getEmails } from "@/data/email";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DraftsPage() {
    const emails = await getEmails("drafts");

    return <DraftEmailsPage emails={emails} />;
}
