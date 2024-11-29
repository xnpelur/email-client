import { ProviderData } from "@/types/provider";

const providersData: (ProviderData & { domains: string[] })[] = [
    {
        domains: ["yandex.ru", "ya.ru", "yandex.by", "yandex.kz", "yandex.com"],
        imapHost: "imap.yandex.ru",
        smtpHost: "smtp.yandex.ru",
        mailboxes: {
            inbox: "INBOX",
            sent: "Sent",
            trash: "Trash",
            drafts: "Drafts",
        },
    },
    {
        domains: ["mail.ru", "internet.ru", "bk.ru", "inbox.ru", "list.ru"],
        imapHost: "imap.mail.ru",
        smtpHost: "smtp.mail.ru",
        mailboxes: {
            inbox: "INBOX",
            sent: "Отправленные",
            trash: "Корзина",
            drafts: "Черновики",
        },
    },
];

export function getProviderData(email: string): ProviderData | undefined {
    const domain = email.split("@")[1];
    const provider = providersData.find((provider) =>
        provider.domains.includes(domain),
    );
    return provider;
}
