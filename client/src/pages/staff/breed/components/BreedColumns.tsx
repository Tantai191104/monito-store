import type { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Breed } from '@/types/breed';

// ✅ Import all dialogs
import { EditBreedDialog } from './EditBreedDialog';
import { DeleteBreedDialog } from './DeleteBreedDialog';
import { DeactivateBreedDialog } from './DeactivateBreedDialog';

export const breedColumns: ColumnDef<Breed>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Breed Name
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px]">
          <div className="font-medium">{row.getValue('name')}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string;

      if (!description) {
        return (
          <span className="text-sm text-gray-400 italic">No description</span>
        );
      }

      // ✅ Truncate long descriptions
      const isLong = description.length > 60;
      const truncated = isLong
        ? `${description.substring(0, 60)}...`
        : description;

      return (
        <div className="max-w-[200px]">
          {/* ✅ Giới hạn width */}
          {isLong ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help truncate text-sm text-gray-600">
                    {truncated}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="text-sm text-gray-600">{description}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'petCount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Pet Count
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const count = (row.getValue('petCount') as number) || 0;
      return (
        <div className="text-center">
          <div className="font-medium">{count}</div>
          <div className="text-xs text-gray-500">
            {count === 1 ? 'pet' : 'pets'}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean;
      return (
        <div className="pl-2.5">
          <Badge
            variant={isActive ? 'default' : 'secondary'}
            className={
              isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }
          >
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (value === 'all') return true;
      return value === 'active' ? row.getValue(id) : !row.getValue(id);
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created At
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return (
        <div className="pl-2.5 text-sm">
          <div>{date.toLocaleDateString('vi-VN')}</div>
          <div className="text-xs text-gray-500">
            {date.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      );
    },
  },
  // ✅ Updated At column
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Updated At
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      const updatedAt = row.getValue('updatedAt') as string;

      if (updatedAt === createdAt) {
        return (
          <span className="pl-2.5 text-sm text-gray-400 italic">
            Never updated
          </span>
        );
      }

      const date = new Date(updatedAt);
      return (
        <div className="pl-2.5 text-sm">
          <div>{date.toLocaleDateString('vi-VN')}</div>
          <div className="text-xs text-gray-500">
            {date.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const breed = row.original;
      return <BreedActionsCell breed={breed} />;
    },
  },
];

// ✅ Complete Actions Cell component
function BreedActionsCell({ breed }: { breed: Breed }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(breed._id);
    toast.success('Breed ID copied to clipboard!');
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={handleCopyId}>
            <Copy className="h-4 w-4" />
            Copy ID
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleEditClick}>
            <Edit className="h-4 w-4" />
            Edit breed
          </DropdownMenuItem>

          {/* ✅ Toggle Status action */}
          <DropdownMenuItem
            onClick={() => setDeactivateDialogOpen(true)}
            className={breed.isActive ? 'text-orange-600' : 'text-green-600'}
          >
            {breed.isActive ? (
              <>
                <EyeOff className="h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Activate
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* ✅ Delete action */}
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Delete breed
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ✅ All Dialogs */}
      <EditBreedDialog
        breed={breed}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <DeactivateBreedDialog
        breed={breed}
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
      />

      <DeleteBreedDialog
        breed={breed}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}
