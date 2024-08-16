import EmailsPage from "@/components/emailsPage";
import { Email } from "@/types/email";

const data: Email[] = [
    {
        author: "SpamBot3000",
        title: "You've Won a Million Dollars!",
        date: new Date("2024-08-08"),
    },
    {
        author: "Prince Charming",
        title: "Urgent: Help Needed to Transfer Funds",
        date: new Date("2024-08-07"),
    },
    {
        author: "Totally Legit Pharmacy",
        title: "Discount Medications - Limited Time Offer!",
        date: new Date("2024-08-06"),
    },
];

export default function SpamPage() {
    return <EmailsPage data={data} title="Спам" />;
}
