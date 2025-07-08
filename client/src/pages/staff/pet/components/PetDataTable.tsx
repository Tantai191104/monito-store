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
import { Search, Trash2, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import {
  useBulkDeletePets,
  useBulkUpdatePetAvailability,
  useDeletePet,
} from '@/hooks/usePets';
import { useActiveBreeds } from '@/hooks/useBreeds';
import type { Pet } from '@/types/pet';
import { DataTableToolbar } from '@/components/ui/data-table/DataTableToolbar';
import { DataTablePagination } from '@/components/ui/data-table/DataTablePagination';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  className?: string;
}

export function PetDataTable<TData extends Pet, TValue>({
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
  const [petToDelete, setPetToDelete] = useState<TData | null>(null);

  // Hooks for bulk and single actions
  const bulkDeletePets = useBulkDeletePets();
  const bulkUpdateAvailability = useBulkUpdatePetAvailability();
  const deletePet = useDeletePet();
  const { data: breeds = [] } = useActiveBreeds(); // Lấy danh sách breeds

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
      // Pass a function to the table meta to allow columns to trigger deletion
      requestDelete: (pet: TData) => {
        setPetToDelete(pet);
      },
    },
  });

  const selectedPets = useMemo(
    () => table.getFilteredSelectedRowModel().rows.map((row) => row.original),
    [rowSelection, table],
  );

  const handleBulkDelete = async () => {
    const idsToDelete = selectedPets.map((p) => p._id);
    await bulkDeletePets.mutateAsync(idsToDelete);
    table.resetRowSelection();
    setBulkDeleteDialogOpen(false);
  };

  const handleSingleDelete = async () => {
    if (!petToDelete) return;
    await deletePet.mutateAsync(petToDelete._id);
    setPetToDelete(null);
  };

  const handleBulkUpdateAvailability = async (isAvailable: boolean) => {
    const idsToUpdate = selectedPets
      .filter((p) => p.isAvailable !== isAvailable)
      .map((p) => p._id);
    if (idsToUpdate.length > 0) {
      await bulkUpdateAvailability.mutateAsync({
        ids: idsToUpdate,
        isAvailable,
      });
    }
    table.resetRowSelection();
  };

  if (isLoading) {
    return (
      <div className={cn('w-full space-y-4', className)}>
        <TableSkeleton rows={10} columns={columns.length} />
      </div>
    );
  }

  return (
    <div className={cn('w-full space-y-4', className)}>
      <DataTableToolbar
        table={table}
        addHref="/staff/pets/add"
        addLabel="Add Pet"
        filterControls={
          <>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Input
                placeholder="Search pets by name..."
                value={
                  (table.getColumn('name')?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  table.getColumn('name')?.setFilterValue(event.target.value)
                }
                className="max-w-sm pl-8"
              />
            </div>
            {/* Breed Filter */}

            <Select
              value={
                (table.getColumn('breed')?.getFilterValue() as string) ?? ''
              }
              onValueChange={(value) =>
                table
                  .getColumn('breed')
                  ?.setFilterValue(value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select breed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Breeds</SelectItem>
                {breeds.map((breed) => (
                  <SelectItem key={breed._id} value={breed.name}>
                    {breed.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Size Filter */}
            <Select
              value={
                (table.getColumn('size')?.getFilterValue() as string) ?? ''
              }
              onValueChange={(value) =>
                table
                  .getColumn('size')
                  ?.setFilterValue(value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="Small">Small</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Large">Large</SelectItem>
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
              onClick={() => handleBulkUpdateAvailability(true)}
              disabled={
                bulkUpdateAvailability.isPending ||
                selectedPets.every((p) => p.isAvailable)
              }
            >
              <ToggleRight className="mr-2 h-4 w-4" />
              Mark as Available
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkUpdateAvailability(false)}
              disabled={
                bulkUpdateAvailability.isPending ||
                selectedPets.every((p) => !p.isAvailable)
              }
            >
              <ToggleLeft className="mr-2 h-4 w-4" />
              Mark as Sold
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteDialogOpen(true)}
              disabled={bulkDeletePets.isPending}
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
              This action will permanently delete {selectedPets.length} pet(s).
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={bulkDeletePets.isPending}
            >
              {bulkDeletePets.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!petToDelete}
        onOpenChange={(open) => !open && setPetToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the pet "
              <strong>{petToDelete?.name}</strong>". This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSingleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deletePet.isPending}
            >
              {deletePet.isPending ? (
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
