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
import { ChevronDown, Search, Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { AddColorDialog } from './AddColorDialog';
import {
  useBulkDeleteColors,
  useBulkActivateColors,
  useBulkDeactivateColors,
  useBulkUpdateColorStatus,
} from '@/hooks/useColors';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  className?: string;
}

export function ColorDataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Bulk operations hooks
  const bulkDeleteColors = useBulkDeleteColors();
  const bulkActivateColors = useBulkActivateColors();
  const bulkDeactivateColors = useBulkDeactivateColors();
  const bulkUpdateStatus = useBulkUpdateColorStatus();

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

  // Pagination helpers
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;
  const totalItems = table.getFilteredRowModel().rows.length;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  // Bulk actions handlers
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedColors = selectedRows.map((row) => row.original as any);
  const selectedIds = selectedColors.map((color) => color._id);

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteColors.mutateAsync(selectedIds);
      setRowSelection({});
    } catch (error) {
      // Error handled in mutation
    }
  };

  // Smart toggle function
  const handleBulkToggleStatus = async (targetStatus: boolean) => {
    const targetIds = selectedColors
      .filter((color) => color.isActive !== targetStatus)
      .map((color) => color._id);

    if (targetIds.length === 0) {
      const statusText = targetStatus ? 'active' : 'inactive';
      toast.info(`All selected colors are already ${statusText}`);
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
        <TableSkeleton rows={10} columns={7} />
      </div>
    );
  }

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Search colors..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
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
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto"
                disabled={isLoading}
              >
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id.replace(/([A-Z])/g, ' $1').trim()}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <AddColorDialog />
        </div>
      </div>

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
                bulkActivateColors.isPending ||
                bulkUpdateStatus.isPending ||
                selectedColors.every((color) => color.isActive)
              }
            >
              {bulkActivateColors.isPending || bulkUpdateStatus.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Activate Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkToggleStatus(false)}
              disabled={
                bulkDeactivateColors.isPending ||
                bulkUpdateStatus.isPending ||
                selectedColors.every((color) => !color.isActive)
              }
            >
              {bulkDeactivateColors.isPending || bulkUpdateStatus.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Deactivate Selected
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={bulkDeleteColors.isPending}
            >
              {bulkDeleteColors.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                  No colors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 pb-4">
        <div className="text-muted-foreground text-sm">
          Showing {startItem} to {endItem} of {totalItems} results
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <p className="shrink-0 text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {totalPages > 1 && !isLoading && (
            <Pagination className="w-fit">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => table.previousPage()}
                    className={
                      !table.getCanPreviousPage()
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {/* Show first page if needed */}
                {currentPage > 3 && totalPages > 5 && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => table.setPageIndex(0)}
                        className="cursor-pointer"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {currentPage > 4 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}

                {/* Page numbers */}
                {getPageNumbers().map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => table.setPageIndex(pageNumber - 1)}
                      isActive={currentPage === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {/* Show last page if needed */}
                {currentPage < totalPages - 2 && totalPages > 5 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => table.setPageIndex(totalPages - 1)}
                        className="cursor-pointer"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => table.nextPage()}
                    className={
                      !table.getCanNextPage()
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
