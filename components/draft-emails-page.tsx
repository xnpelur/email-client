"use client";

import EmailsPage from "@/components/emails-page";
import NewEmailDialog from "@/components/new-email-dialog";
import { getEmail } from "@/data/email";
import { Email } from "@/types/email";
import { useState } from "react";

type Props = {
    emails: Email[];
};

export default function DraftEmailsPage({ emails }: Props) {
    const [selectedEmail, setSelectedEmail] = useState<Email | undefined>();

    async function fetchEmail(sequenceNumber: number) {
        const email = await getEmail("Черновики", sequenceNumber);
        setSelectedEmail(email);
    }

    return (
        <>
            <EmailsPage
                emails={emails}
                title="Черновики"
                url="/drafts"
                onClick={fetchEmail}
            />
            <NewEmailDialog
                key={selectedEmail?.seqNo}
                email={selectedEmail}
                hideTrigger
            />
        </>
    );
}
