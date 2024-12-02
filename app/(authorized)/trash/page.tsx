import { EmailsPage } from "@/components/emails-page";
import { getEmails } from "@/data/email";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TrashPage() {
    const emails = await getEmails("trash");

    return <EmailsPage emails={emails} title="Корзина" url="/trash" />;
}
