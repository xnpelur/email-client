import { ColumnDef } from "@tanstack/react-table";
import { Email } from "@/types/email";

export const getEmailColumns = (
    currentUserAddress: string,
): ColumnDef<Email>[] => [
    {
        accessorKey: "contact",
        cell: ({ row }) => {
            const from = row.original.from;
            const to = row.original.to;

            const contact = from.address === currentUserAddress ? to : from;

            return (
                <div>
                    {contact.name.length > 0 ? contact.name : contact.address}
                </div>
            );
        },
        size: 250,
    },
    {
        accessorKey: "subject",
        cell: ({ row }) => <div>{row.getValue("subject")}</div>,
    },
    {
        accessorKey: "date",
        cell: ({ row }) => {
            const date = row.getValue("date") as Date;
            const now = new Date();
            const isToday = date.toDateString() === now.toDateString();

            const dateString = isToday
                ? date.toLocaleTimeString("ru", {
                      hour: "2-digit",
                      minute: "2-digit",
                  })
                : date.toLocaleDateString("ru", {
                      day: "numeric",
                      month: "short",
                  });

            return (
                <div className="flex items-center justify-end">
                    <span className="text-muted-foreground">{dateString}</span>
                </div>
            );
        },
        size: 100,
    },
];
