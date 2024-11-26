import EmailsPage from "@/components/emails-page";
import { getTrashEmails } from "@/data/email";
import { getCurrentUser } from "@/data/user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TrashPage() {
    const emails = await getTrashEmails();

    return (
        <EmailsPage
            emails={emails}
            title="Корзина"
            user={getCurrentUser()}
            url="/trash"
        />
    );
}
