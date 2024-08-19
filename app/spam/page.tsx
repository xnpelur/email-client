"use client";

import EmailsPage from "@/components/emailsPage";
import { Email } from "@/types/email";

const data: Email[] = [
    {
        from: "SpamBot3000",
        to: "You",
        title: "You've Won a Million Dollars!",
        date: new Date("2024-08-08"),
    },
    {
        from: "Prince Charming",
        to: "You",
        title: "Urgent: Help Needed to Transfer Funds",
        date: new Date("2024-08-07"),
    },
    {
        from: "Totally Legit Pharmacy",
        to: "You",
        title: "Discount Medications - Limited Time Offer!",
        date: new Date("2024-08-06"),
    },
];

export default function SpamPage() {
    return (
        <EmailsPage
            data={data}
            title="Спам"
            getContactText={(email) => email.from}
        />
    );
}
