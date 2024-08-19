"use client";

import EmailsPage from "@/components/emailsPage";
import { Email } from "@/types/email";

const data: Email[] = [
    {
        from: "You",
        to: "",
        title: "Meeting Reminder",
        date: new Date("2024-08-05"),
    },
];

export default function DraftsPage() {
    return (
        <EmailsPage
            data={data}
            title="Черновики"
            getContactText={() => "Черновик"}
        />
    );
}
