"use client";

import EmailsPage from "@/components/emailsPage";
import { Email } from "@/types/email";

const data: Email[] = [
    {
        from: "Ken",
        to: "You",
        title: "Re: Important Update",
        date: new Date("2024-08-08"),
    },
    {
        from: "Abe",
        to: "You",
        title: "Meeting Agenda",
        date: new Date("2024-08-07"),
    },
    {
        from: "Monserrat",
        to: "You",
        title: "Project Proposal",
        date: new Date("2024-08-06"),
    },
    {
        from: "Silas",
        to: "You",
        title: "Weekly Report",
        date: new Date("2024-08-05"),
    },
    {
        from: "Carmella",
        to: "You",
        title: "Vacation Request",
        date: new Date("2024-08-04"),
    },
    {
        from: "Elena",
        to: "You",
        title: "Client Feedback",
        date: new Date("2024-08-03"),
    },
    {
        from: "Liam",
        to: "You",
        title: "Budget Review",
        date: new Date("2024-08-02"),
    },
    {
        from: "Sophia",
        to: "You",
        title: "Team Building Event",
        date: new Date("2024-08-01"),
    },
    {
        from: "Oliver",
        to: "You",
        title: "Product Launch",
        date: new Date("2024-07-31"),
    },
    {
        from: "Isabella",
        to: "You",
        title: "Training Schedule",
        date: new Date("2024-07-30"),
    },
];

export default function InboxPage() {
    return (
        <EmailsPage
            data={data}
            title="Входящие"
            getContactText={(email) => email.from}
        />
    );
}
