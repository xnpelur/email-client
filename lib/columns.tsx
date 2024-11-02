import { ColumnDef } from "@tanstack/react-table";
import { Email } from "@/types/email";
import { formatRelative } from "date-fns";
import { ru } from "date-fns/locale";

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
        cell: ({ row }) => (
            <div className="text-right">
                {formatRelative(row.getValue("date"), new Date(), {
                    locale: ru,
                })}
            </div>
        ),
        size: 175,
    },
];
