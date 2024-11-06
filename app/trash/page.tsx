import EmailsPage from "@/components/emailsPage";
import { getTrashEmails } from "@/data/email";
import { getCurrentUser } from "@/data/user";

export default async function TrashPage() {
    const emails = await getTrashEmails();

    return (
        <EmailsPage emails={emails} title="Корзина" user={getCurrentUser()} />
    );
}
