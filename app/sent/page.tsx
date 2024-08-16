"use client";

import EmailsPage from "@/components/emailsPage";
import { Email } from "@/types/email";

const data: Email[] = [
    {
        author: "You",
        title: "Project Status Update",
        date: new Date("2024-08-10"),
    },
    {
        author: "You",
        title: "Client Proposal",
        date: new Date("2024-08-09"),
    },
    {
        author: "You",
        title: "Team Meeting Summary",
        date: new Date("2024-08-08"),
    },
    {
        author: "You",
        title: "Quarterly Report Draft",
        date: new Date("2024-08-07"),
    },
    {
        author: "You",
        title: "Vacation Request",
        date: new Date("2024-08-06"),
    },
];

export default function SentPage() {
    return <EmailsPage data={data} title="Отправленные" />;
}
