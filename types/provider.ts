export type ProviderData = {
    imapHost: string;
    smtpHost: string;
    mailboxes: {
        inbox: string;
        sent: string;
        trash: string;
        drafts: string;
    };
};
