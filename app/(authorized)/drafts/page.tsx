import { DraftEmailsPage } from "@/components/draft-emails-page";
import { getDraftEmails } from "@/data/email";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DraftsPage() {
    const emails = await getDraftEmails();

    return <DraftEmailsPage emails={emails} />;
}
