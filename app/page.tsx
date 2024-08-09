"use client";

import * as React from "react";
import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
import { getEmailColumns } from "@/lib/columns";
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

export default function Home() {
    const columns = getEmailColumns();
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
    });

    return (
        <div className="w-full px-4">
            <div className="flex justify-between py-4">
                <h1 className="text-2xl font-semibold">Входящие</h1>
                <Input
                    placeholder="Поиск..."
                    value={
                        (table
                            .getColumn("email")
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("email")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-lg"
                />
                <div></div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Нет результатов.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <CaretLeftIcon />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <CaretRightIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
}
