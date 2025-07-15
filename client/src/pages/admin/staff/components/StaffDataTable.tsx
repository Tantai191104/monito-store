import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Eye,
  EyeOff,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { DataTablePagination } from '@/components/ui/data-table/DataTablePagination';
import { DEPARTMENTS } from '@/types/staff';
import type { Staff } from '@/types/staff';
import { AddStaffDialog } from './AddStaffDialog';
import { useDeleteStaff, useUpdateStaff } from '@/hooks/useStaff';
import { toast } from 'sonner';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  className?: string;
}

export function StaffDataTable<TData extends Staff, TValue>({
  columns,
  data,
  isLoading = false,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const deleteStaff = useDeleteStaff();
  const updateStaff = useUpdateStaff();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;
  const totalRowCount = table.getFilteredRowModel().rows.length;

  // ✅ Filter functions for toolbar
  const departmentFilterOptions = DEPARTMENTS.map((dept) => ({
    label: dept,
    value: dept,
  }));

  const statusFilterOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  // ✅ Handle bulk actions
  const handleBulkActivate = async () => {
    const selectedStaff = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original);

    if (selectedStaff.length === 0) return;

    try {
      await Promise.all(
        selectedStaff.map((staff) =>
          updateStaff.mutateAsync({
            id: staff._id,
            data: { isActive: true },
          }),
        ),
      );
      toast.success(
        `${selectedStaff.length} staff members activated successfully!`,
      );
      table.resetRowSelection();
    } catch (error) {
      toast.error('Failed to activate some staff members');
    }
  };

  const handleBulkDeactivate = async () => {
    const selectedStaff = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original);

    if (selectedStaff.length === 0) return;

    if (
      window.confirm(
        `Are you sure you want to deactivate ${selectedStaff.length} staff members?`,
      )
    ) {
      try {
        await Promise.all(
          selectedStaff.map((staff) =>
            updateStaff.mutateAsync({
              id: staff._id,
              data: { isActive: false },
            }),
          ),
        );
        toast.success(
          `${selectedStaff.length} staff members deactivated successfully!`,
        );
        table.resetRowSelection();
      } catch (error) {
        toast.error('Failed to deactivate some staff members');
      }
    }
  };

  const handleBulkDelete = async () => {
    const selectedStaff = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original);

    if (selectedStaff.length === 0) return;

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedStaff.length} staff members? This action cannot be undone.`,
      )
    ) {
      try {
        await Promise.all(
          selectedStaff.map((staff) => deleteStaff.mutateAsync(staff._id)),
        );
        toast.success(
          `${selectedStaff.length} staff members deleted successfully!`,
        );
        table.resetRowSelection();
      } catch (error) {
        toast.error('Failed to delete some staff members');
      }
    }
  };

  if (isLoading) {
    return (
      <div className={cn('', className)}>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* ✅ Toolbar with filters and actions */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {/* Search */}
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Search staff..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="max-w-sm pl-8"
            />
          </div>

          {/* Department Filter */}
          {/* NOTE: NEU CO BAO LOI VUI LONG KE ME DOAN PHAN NAY */}
          <Select
            value={
              (table.getColumn('department')?.getFilterValue() as string) ??
              'all'
            }
            onValueChange={(value) =>
              table
                .getColumn('department')
                ?.setFilterValue(value === 'all' ? '' : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departmentFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={
              (table.getColumn('isActive')?.getFilterValue() as string) ?? 'all'
            }
            onValueChange={(value) =>
              table
                .getColumn('isActive')
                ?.setFilterValue(value === 'all' ? '' : value)
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear filters */}
          {(table.getColumn('name')?.getFilterValue() ||
            table.getColumn('department')?.getFilterValue() ||
            table.getColumn('isActive')?.getFilterValue()) && (
            <Button
              variant="ghost"
              onClick={() => {
                table.getColumn('name')?.setFilterValue('');
                table.getColumn('department')?.setFilterValue('');
                table.getColumn('isActive')?.setFilterValue('');
              }}
            >
              Reset
            </Button>
          )}
        </div>

        {/* ✅ Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Bulk actions */}
          {selectedRowCount > 0 && (
            <div className="mr-4 flex items-center space-x-2">
              <Badge variant="secondary">
                {selectedRowCount} of {totalRowCount} selected
              </Badge>

              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkActivate}
                className="text-green-600"
              >
                <Eye className="h-4 w-4" />
                Activate
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDeactivate}
                className="text-orange-600"
              >
                <EyeOff className="h-4 w-4" />
                Deactivate
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          )}

          {/* Add staff button */}
          <AddStaffDialog
            trigger={
              <Button>
                <Plus className="h-4 w-4" />
                Add Staff
              </Button>
            }
          />
        </div>
      </div>

      {/* ✅ Data table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-muted/50"
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
                  <div className="text-muted-foreground flex flex-col items-center justify-center">
                    <Users className="mb-2 h-8 w-8" />
                    <p className="text-lg font-medium">
                      No staff members found
                    </p>
                    <p className="text-sm">
                      Try adjusting your search criteria
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ✅ Pagination */}
      <DataTablePagination table={table} />
    </div>
  );
}
