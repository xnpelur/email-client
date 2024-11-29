import { EmailsPage } from "@/components/emails-page";
import { getTrashEmails } from "@/data/email";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TrashPage() {
    const emails = await getTrashEmails();

    return <EmailsPage emails={emails} title="Корзина" url="/trash" />;
}
