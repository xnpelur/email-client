import EmailsPage from "@/components/emailsPage";
import { getTrashEmails } from "@/lib/email";
import { getCurrentUser } from "@/lib/user";

export default async function TrashPage() {
    const emails = await getTrashEmails();

    return (
        <EmailsPage emails={emails} title="Корзина" user={getCurrentUser()} />
    );
}
