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
import {
  Search,
  Trash2,
  Loader2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useState, useMemo } from 'react';

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import {
  useBulkDeleteProducts,
  useBulkUpdateProductStatus,
  useDeleteProduct,
} from '@/hooks/useProducts';
import { useActiveCategories } from '@/hooks/useCategories'; // Import hook để lấy categories
import type { Product } from '@/types/product';
import { DataTableToolbar } from '@/components/ui/data-table/DataTableToolbar';
import { DataTablePagination } from '@/components/ui/data-table/DataTablePagination';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  className?: string;
}

export function ProductDataTable<TData extends Product, TValue>({
  columns,
  data,
  isLoading = false,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<TData | null>(null);

  const bulkDeleteProducts = useBulkDeleteProducts();
  const bulkUpdateStatus = useBulkUpdateProductStatus();
  const deleteProduct = useDeleteProduct();
  const { data: categories = [] } = useActiveCategories(); // Lấy danh sách categories

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
    meta: {
      requestDelete: (product: TData) => {
        setProductToDelete(product);
      },
    },
  });

  const selectedProducts = useMemo(
    () => table.getFilteredSelectedRowModel().rows.map((row) => row.original),
    [rowSelection, table],
  );

  const handleBulkDelete = async () => {
    const idsToDelete = selectedProducts.map((p) => p._id);
    await bulkDeleteProducts.mutateAsync(idsToDelete);
    table.resetRowSelection();
    setBulkDeleteDialogOpen(false);
  };

  const handleSingleDelete = async () => {
    if (!productToDelete) return;
    await deleteProduct.mutateAsync(productToDelete._id);
    setProductToDelete(null);
  };

  const handleBulkUpdateStatus = async (isActive: boolean) => {
    const idsToUpdate = selectedProducts
      .filter((p) => p.isActive !== isActive)
      .map((p) => p._id);
    if (idsToUpdate.length > 0) {
      await bulkUpdateStatus.mutateAsync({ ids: idsToUpdate, isActive });
    }
    table.resetRowSelection();
  };

  if (isLoading) {
    return (
      <div className={cn('w-full space-y-4', className)}>
        <TableSkeleton rows={10} columns={11} />
      </div>
    );
  }

  return (
    <div className={cn('w-full space-y-4', className)}>
      <DataTableToolbar
        table={table}
        addHref="/staff/products/add"
        addLabel="Add Product"
        filterControls={
          <>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={
                  (table.getColumn('name')?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  table.getColumn('name')?.setFilterValue(event.target.value)
                }
                className="max-w-sm pl-8"
              />
            </div>
            <Select
              value={
                (table.getColumn('category')?.getFilterValue() as string) ?? ''
              }
              onValueChange={(value) =>
                table
                  .getColumn('category')
                  ?.setFilterValue(value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />

      {/* Selected items actions */}
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <div className="bg-muted/50 mb-4 flex items-center justify-between rounded-md border px-4 py-2">
          <div className="text-muted-foreground text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkUpdateStatus(true)}
              disabled={
                bulkUpdateStatus.isPending ||
                selectedProducts.every((p) => p.isActive)
              }
            >
              <ToggleRight className="mr-2 h-4 w-4" />
              Activate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkUpdateStatus(false)}
              disabled={
                bulkUpdateStatus.isPending ||
                selectedProducts.every((p) => !p.isActive)
              }
            >
              <ToggleLeft className="mr-2 h-4 w-4" />
              Deactivate
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteDialogOpen(true)}
              disabled={bulkDeleteProducts.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
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
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />

      {/* Dialogs */}
      <AlertDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete {selectedProducts.length}{' '}
              product(s). This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={bulkDeleteProducts.isPending}
            >
              {bulkDeleteProducts.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the product "
              <strong>{productToDelete?.name}</strong>". This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSingleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
