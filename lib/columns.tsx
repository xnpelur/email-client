import { ColumnDef } from "@tanstack/react-table";
import { Email } from "@/types/email";
import { formatRelative } from "date-fns";
import { ru } from "date-fns/locale";

export const getEmailColumns = (): ColumnDef<Email>[] => [
    {
        accessorKey: "author",
        cell: ({ row }) => <div>{row.getValue("author")}</div>,
    },
    {
        accessorKey: "title",
        cell: ({ row }) => <div>{row.getValue("title")}</div>,
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
