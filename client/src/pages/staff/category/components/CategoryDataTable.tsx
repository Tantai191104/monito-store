import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Search, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { AddCategoryDialog } from './AddCategoryDialog';
import {
  useBulkDeleteCategories,
  useBulkActivateCategories,
  useBulkDeactivateCategories,
  useBulkUpdateCategoryStatus,
} from '@/hooks/useCategories';

// ✅ Import reusable components
import { DataTableToolbar } from '@/components/ui/data-table/DataTableToolbar';
import { DataTablePagination } from '@/components/ui/data-table/DataTablePagination';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  className?: string;
}

export function CategoryDataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // ✅ Use bulk operations hooks
  const bulkDeleteCategories = useBulkDeleteCategories();
  const bulkActivateCategories = useBulkActivateCategories();
  const bulkDeactivateCategories = useBulkDeactivateCategories();
  const bulkUpdateStatus = useBulkUpdateCategoryStatus();

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
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // ✅ Updated bulk actions handlers
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCategories = selectedRows.map((row) => row.original as any);
  const selectedIds = selectedCategories.map((cat) => cat._id);

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteCategories.mutateAsync(selectedIds);
      setRowSelection({});
    } catch (error) {
      // Error handled in mutation
    }
  };

  // ✅ Smart toggle function
  const handleBulkToggleStatus = async (targetStatus: boolean) => {
    const targetIds = selectedCategories
      .filter((cat) => cat.isActive !== targetStatus)
      .map((cat) => cat._id);

    if (targetIds.length === 0) {
      const statusText = targetStatus ? 'active' : 'inactive';
      toast.info(`All selected categories are already ${statusText}`);
      return;
    }

    try {
      await bulkUpdateStatus.mutateAsync({
        ids: targetIds,
        targetStatus,
      });
      setRowSelection({});
    } catch (error) {
      // Error handled in mutation
    }
  };

  // Show loading skeleton while loading
  if (isLoading) {
    return (
      <div className={cn('w-full space-y-4', className)}>
        <TableSkeleton rows={10} columns={6} />
      </div>
    );
  }

  // ✅ Create filter controls for DataTableToolbar
  const filterControls = (
    <>
      {/* Search */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
        <Input
          placeholder="Search categories..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm pl-8"
          disabled={isLoading}
        />
      </div>

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
        disabled={isLoading}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </>
  );

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* ✅ Use DataTableToolbar with custom add button */}
      <DataTableToolbar
        table={table}
        filterControls={filterControls}
        addButton={<AddCategoryDialog />} // ✅ Pass custom button
      />

      {/* Selected items actions */}
      {selectedRows.length > 0 && !isLoading && (
        <div className="bg-muted/50 flex items-center justify-between rounded-md border px-4 py-2">
          <div className="text-muted-foreground text-sm">
            {selectedRows.length} of {table.getFilteredRowModel().rows.length}{' '}
            row(s) selected.
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkToggleStatus(true)}
              disabled={
                bulkActivateCategories.isPending ||
                bulkUpdateStatus.isPending ||
                selectedCategories.every((cat) => cat.isActive)
              }
            >
              {bulkActivateCategories.isPending ||
              bulkUpdateStatus.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Activate Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkToggleStatus(false)}
              disabled={
                bulkDeactivateCategories.isPending ||
                bulkUpdateStatus.isPending ||
                selectedCategories.every((cat) => !cat.isActive)
              }
            >
              {bulkDeactivateCategories.isPending ||
              bulkUpdateStatus.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Deactivate Selected
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={bulkDeleteCategories.isPending}
            >
              {bulkDeleteCategories.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
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
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ✅ Use DataTablePagination component */}
      <DataTablePagination table={table} />
    </div>
  );
}
