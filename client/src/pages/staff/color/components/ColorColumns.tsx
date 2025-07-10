import { toast } from 'sonner';
import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  CopyIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Color } from '@/types/color';
import { EditColorDialog } from './EditColorDialog';
import { DeactivateColorDialog } from './DeactivateColorDialog';
import { DeleteColorDialog } from './DeleteColorDialog';

export const colorColumns: ColumnDef<Color>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
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
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const color = row.original;
      return (
        <div className="max-w-[150px]">
          <div className="font-medium">{color.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'hexCode',
    header: 'Hex Code',
    cell: ({ row }) => {
      const hexCode = row.getValue('hexCode') as string;
      return (
        <div className="flex items-center space-x-2">
          <div
            className="h-8 w-8 rounded border-2 border-gray-300"
            style={{ backgroundColor: hexCode }}
          />
          <span className="font-mono text-sm">{hexCode}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string;
      return description ? (
        <div className="max-w-[300px]">
          <p className="w-full truncate text-sm text-gray-600">{description}</p>
        </div>
      ) : (
        <span className="text-sm text-gray-400 italic">No description</span>
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
    // ✅ Fix filterFn to handle string-based filtering
    filterFn: (row, id, value) => {
      if (!value || value === 'all') return true;

      const isActive = row.getValue(id) as boolean;
      return value === 'active' ? isActive : !isActive;
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return (
        <div className="text-sm">
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
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Updated At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      const updatedAt = row.getValue('updatedAt') as string;

      if (updatedAt === createdAt) {
        return (
          <span className="text-sm text-gray-400 italic">Never updated</span>
        );
      }

      const date = new Date(updatedAt);
      return (
        <div className="text-sm">
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
      const color = row.original;

      return <ColorActionsCell color={color} />;
    },
  },
];

// Separate component for actions to handle hooks properly
function ColorActionsCell({ color }: { color: Color }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(color._id);
    toast.success('Color ID copied to clipboard!');
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
            <CopyIcon className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEditClick}>
            <Edit className="mr-2 h-4 w-4" />
            Edit color
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeactivateDialogOpen(true)}
            className={color.isActive ? 'text-orange-600' : 'text-green-600'}
          >
            {color.isActive ? (
              <>
                <ToggleLeft className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <ToggleRight className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete color
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* EditDialog outside DropdownMenu with controlled state */}
      <EditColorDialog
        color={color}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <DeactivateColorDialog
        color={color}
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
      />

      <DeleteColorDialog
        color={color}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}
