import { ColumnDef } from "@tanstack/react-table";
import { Email } from "@/types/email";

export const getEmailColumns = (pathname: string): ColumnDef<Email>[] => [
    {
        accessorKey: "contact",
        cell: ({ row }) => {
            switch (pathname) {
                case "/inbox":
                    return <div>{row.original.from.name}</div>;
                case "/sent":
                    return <div>{row.original.to.address}</div>;
                case "/drafts":
                    return <div>Черновик</div>;
                case "/trash":
                    return <div>{row.original.from.address}</div>;
            }
            throw new Error("Unknown pathname");
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
