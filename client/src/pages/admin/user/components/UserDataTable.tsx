import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
    type ColumnFiltersState,
    type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Users } from 'lucide-react';
import { DataTablePagination } from '@/components/ui/data-table/DataTablePagination';
import type { UserResponse } from '@/services/userService';
import { getUserColumns } from './UserColumns';
interface UserDataTableProps {
    data: UserResponse[];
    onViewDetail: (user: UserResponse) => void;
    onToggleActive: (user: UserResponse, action: 'suspend' | 'activate') => void;
}

export function UserDataTable({
    data,
    onViewDetail,
    onToggleActive,
}: UserDataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const columns = getUserColumns({ onViewDetail, onToggleActive });

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                        onChange={(e) =>
                            table.getColumn('name')?.setFilterValue(e.target.value)
                        }
                        className="pl-8"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((group) => (
                            <TableRow key={group.id}>
                                {group.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="text-muted-foreground flex flex-col items-center justify-center">
                                        <Users className="mb-2 h-8 w-8" />
                                        <p className="text-lg font-medium">No users found</p>
                                        <p className="text-sm">Try adjusting your search</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <DataTablePagination table={table} />
        </div>
    );
}
