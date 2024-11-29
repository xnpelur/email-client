import EmailView from "@/components/email-view";
import { getEmail } from "@/data/email";

export default async function EmailPage({
    params,
}: {
    params: { seqNo: string };
}) {
    const email = await getEmail("trash", parseInt(params.seqNo));

    return (
        <EmailView email={email} mailbox="trash" previousPageTitle="Корзина" />
    );
}
