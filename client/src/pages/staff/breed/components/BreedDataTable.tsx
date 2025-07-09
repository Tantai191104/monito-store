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

// ✅ Import reusable components và hooks
import { DataTableToolbar } from '@/components/ui/data-table/DataTableToolbar';
import { DataTablePagination } from '@/components/ui/data-table/DataTablePagination';
import {
  useBulkDeleteBreeds,
  useBulkActivateBreeds,
  useBulkDeactivateBreeds,
} from '@/hooks/useBreeds';
import { toast } from 'sonner';
import { AddBreedDialog } from './AddBreedDialog';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  className?: string;
}

export function BreedDataTable<TData, TValue>({
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
  const bulkDeleteBreeds = useBulkDeleteBreeds();
  const bulkActivateBreeds = useBulkActivateBreeds();
  const bulkDeactivateBreeds = useBulkDeactivateBreeds();

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

  // ✅ Bulk actions handlers
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedBreeds = selectedRows.map((row) => row.original as any);
  const selectedIds = selectedBreeds.map((breed) => breed._id);

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteBreeds.mutateAsync(selectedIds);
      setRowSelection({});
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleBulkToggleStatus = async (targetStatus: boolean) => {
    const targetIds = selectedBreeds
      .filter((breed) => breed.isActive !== targetStatus)
      .map((breed) => breed._id);

    if (targetIds.length === 0) {
      const statusText = targetStatus ? 'active' : 'inactive';
      toast.info(`All selected breeds are already ${statusText}`);
      return;
    }

    try {
      if (targetStatus) {
        await bulkActivateBreeds.mutateAsync(targetIds);
      } else {
        await bulkDeactivateBreeds.mutateAsync(targetIds);
      }
      setRowSelection({});
    } catch (error) {
      // Error handled in mutation
    }
  };

  // Show loading skeleton while loading
  if (isLoading) {
    return (
      <div className={cn('w-full space-y-4', className)}>
        <TableSkeleton rows={10} columns={5} />
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
          placeholder="Search breeds..."
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
            ?.setFilterValue(value === 'all' ? '' : value === 'active')
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

      {/* ✅ Sort Options */}
      <Select
        value={
          table.getState().sorting[0]
            ? `${table.getState().sorting[0].id}-${table.getState().sorting[0].desc ? 'desc' : 'asc'}`
            : 'createdAt-desc'
        }
        onValueChange={(value) => {
          const [field, order] = value.split('-');
          table.resetSorting();
          table.getColumn(field)?.toggleSorting(order === 'desc');
        }}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt-desc">Newest First</SelectItem>
          <SelectItem value="createdAt-asc">Oldest First</SelectItem>
          <SelectItem value="name-asc">Name A-Z</SelectItem>
          <SelectItem value="name-desc">Name Z-A</SelectItem>
          <SelectItem value="petCount-desc">Most Pets</SelectItem>
          <SelectItem value="petCount-asc">Least Pets</SelectItem>
        </SelectContent>
      </Select>
    </>
  );

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* ✅ Use DataTableToolbar component */}
      <DataTableToolbar
        table={table}
        filterControls={filterControls}
        addButton={<AddBreedDialog />}
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
                bulkActivateBreeds.isPending ||
                selectedBreeds.every((breed) => breed.isActive)
              }
            >
              {bulkActivateBreeds.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Activate Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkToggleStatus(false)}
              disabled={
                bulkDeactivateBreeds.isPending ||
                selectedBreeds.every((breed) => !breed.isActive)
              }
            >
              {bulkDeactivateBreeds.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Deactivate Selected
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={bulkDeleteBreeds.isPending}
            >
              {bulkDeleteBreeds.isPending ? (
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
                  No breeds found.
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
