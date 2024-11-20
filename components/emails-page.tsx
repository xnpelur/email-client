"use client";

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
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    user: {
        name: string;
        address: string;
    };
    emails: Email[];
    title: string;
    url: string;
};

export default function EmailsPage(props: Props) {
    const columns = getEmailColumns(props.user.address);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const router = useRouter();

    const table = useReactTable({
        data: props.emails,
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

    const { pageIndex, pageSize } = table.getState().pagination;
    const rowsCount = table.getFilteredRowModel().rows.length;

    const rowsShownString = useMemo(() => {
        const startRow = rowsCount != 0 ? pageIndex * pageSize + 1 : 0;
        const endRow = Math.min((pageIndex + 1) * pageSize, rowsCount);

        return `${startRow} - ${endRow} из ${rowsCount}`;
    }, [pageIndex, pageSize, rowsCount]);

    return (
        <div className="w-full px-4">
            <div className="flex flex-col items-center justify-between py-4 lg:flex-row">
                <h1 className="flex-1 text-2xl font-semibold">{props.title}</h1>
                <Input
                    placeholder="Поиск..."
                    value={
                        (table
                            .getColumn("subject")
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("subject")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-lg"
                />
                <div className="flex-1"></div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="cursor-pointer"
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                    onClick={() => {
                                        router.push(
                                            `${props.url}/${row.original.seqNo}`,
                                        );
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            width={
                                                cell.column.getSize() !== 150
                                                    ? cell.column.getSize()
                                                    : "auto"
                                            }
                                        >
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
            <div className="flex items-center justify-end space-x-4 py-4">
                <div className="text-sm text-muted-foreground">
                    {rowsShownString}
                </div>
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