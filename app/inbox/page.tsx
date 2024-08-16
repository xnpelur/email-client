import EmailsPage from "@/components/emailsPage";
import { Email } from "@/types/email";

const data: Email[] = [
    {
        author: "Ken",
        title: "Re: Important Update",
        date: new Date("2024-08-08"),
    },
    {
        author: "Abe",
        title: "Meeting Agenda",
        date: new Date("2024-08-07"),
    },
    {
        author: "Monserrat",
        title: "Project Proposal",
        date: new Date("2024-08-06"),
    },
    {
        author: "Silas",
        title: "Weekly Report",
        date: new Date("2024-08-05"),
    },
    {
        author: "Carmella",
        title: "Vacation Request",
        date: new Date("2024-08-04"),
    },
    {
        author: "Elena",
        title: "Client Feedback",
        date: new Date("2024-08-03"),
    },
    {
        author: "Liam",
        title: "Budget Review",
        date: new Date("2024-08-02"),
    },
    {
        author: "Sophia",
        title: "Team Building Event",
        date: new Date("2024-08-01"),
    },
    {
        author: "Oliver",
        title: "Product Launch",
        date: new Date("2024-07-31"),
    },
    {
        author: "Isabella",
        title: "Training Schedule",
        date: new Date("2024-07-30"),
    },
];

export default function InboxPage() {
    return <EmailsPage data={data} title="Входящие" />;
}
