"use client";

import EmailsPage from "@/components/emailsPage";
import { Email } from "@/types/email";

const data: Email[] = [
    {
        from: "You",
        to: "Important Client",
        title: "Project Status Update",
        date: new Date("2024-08-10"),
    },
    {
        from: "You",
        to: "Client",
        title: "Client Proposal",
        date: new Date("2024-08-09"),
    },
    {
        from: "You",
        to: "Team",
        title: "Team Meeting Summary",
        date: new Date("2024-08-08"),
    },
    {
        from: "You",
        to: "Boss",
        title: "Quarterly Report Draft",
        date: new Date("2024-08-07"),
    },
    {
        from: "You",
        to: "HR",
        title: "Vacation Request",
        date: new Date("2024-08-06"),
    },
];

export default function SentPage() {
    return (
        <EmailsPage
            data={data}
            title="Отправленные"
            getContactText={(email) => "Кому: " + email.to}
        />
    );
}
