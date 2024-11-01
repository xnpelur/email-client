import { ColumnDef } from "@tanstack/react-table";
import { Email } from "@/types/email";
import { formatRelative } from "date-fns";
import { ru } from "date-fns/locale";

export const getEmailColumns = (): ColumnDef<Email>[] => [
    {
        accessorKey: "contact",
        cell: ({ row }) => <div>TODO</div>,
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
    },
];
