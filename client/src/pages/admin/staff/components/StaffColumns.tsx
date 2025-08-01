import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Copy,
  Edit,
  Eye,
  EyeOff,
  Loader2,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Staff } from '@/types/staff';
import { EditStaffDialog } from './EditStaffDialog';
import { useDeleteStaff, useUpdateStaff } from '@/hooks/useStaff';
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

// ✅ Thêm khai báo này để TypeScript hiểu rõ hơn về table meta
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    // Bạn có thể thêm các thuộc tính meta tùy chỉnh ở đây nếu cần
  }
}

export const staffColumns: ColumnDef<Staff>[] = [
  // ✅ Selection column
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

  // ✅ Staff member info with avatar
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const staff = row.original;
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={staff.avatarUrl || ''} alt={staff.name} />
            <AvatarFallback>
              {staff.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{staff.name}</div>
            <div className="text-sm text-gray-600">{staff.email}</div>
            {staff.phone && (
              <div className="text-sm text-gray-500">{staff.phone}</div>
            )}
          </div>
        </div>
      );
    },
  },

  // ✅ Department with colored badge
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => {
      const department = row.getValue('department') as string;
      const getDepartmentColor = (dept: string) => {
        switch (dept) {
          case 'Customer Service':
            return 'bg-blue-100 text-blue-800';
          case 'Product Management':
            return 'bg-purple-100 text-purple-800';
          case 'Operations':
            return 'bg-green-100 text-green-800';
          case 'Marketing':
            return 'bg-orange-100 text-orange-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      };

      return (
        <Badge className={getDepartmentColor(department)}>{department}</Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (value === 'all') return true;
      return row.getValue(id) === value;
    },
  },

  // ✅ Position
  {
    accessorKey: 'position',
    header: 'Position',
    cell: ({ row }) => {
      const position = row.getValue('position') as string;
      return <div className="font-medium">{position}</div>;
    },
  },

  // ✅ Status with colored badge
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean;
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      if (value === 'active') return row.getValue(id) === true;
      if (value === 'inactive') return row.getValue(id) === false;
      return true;
    },
  },

  // ✅ Permissions with tooltip
  {
    accessorKey: 'permissions',
    header: 'Permissions',
    cell: ({ row }) => {
      const permissions = row.getValue('permissions') as string[];

      if (permissions.length === 0) {
        return (
          <span className="text-sm text-gray-400 italic">No permissions</span>
        );
      }

      return (
        <div className="flex flex-wrap gap-1">
          {permissions.slice(0, 2).map((permission) => (
            <Badge key={permission} variant="outline" className="text-xs">
              {permission}
            </Badge>
          ))}
          {permissions.length > 2 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="cursor-help text-xs">
                    +{permissions.length - 2}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[300px]">
                  <div className="space-y-1">
                    <p className="font-medium">All Permissions:</p>
                    <div className="flex flex-wrap gap-1 pb-2">
                      {permissions.map((permission) => (
                        <Badge
                          key={permission}
                          variant="outline"
                          className="text-xs text-white"
                        >
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },

  // ✅ Join date
  {
    accessorKey: 'joinDate',
    header: 'Join Date',
    cell: ({ row }) => {
      const joinDate = new Date(row.getValue('joinDate'));
      return (
        <div className="pl-2.5 text-sm">
          <div>{joinDate.toLocaleDateString('vi-VN')}</div>
          <div className="text-xs text-gray-500">
            {joinDate.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      );
    },
  },

  // ✅ Last login
  {
    accessorKey: 'lastLogin',
    header: 'Activity',
    cell: ({ row }) => {
      const lastLoginValue = row.getValue('lastLogin');

      if (!lastLoginValue) {
        return (
          <span className="pl-2.5 text-sm text-gray-400 italic">Never</span>
        );
      }

      const lastLogin = new Date(lastLoginValue as string);

      return (
        <div className="pl-2.5 text-sm">
          <div>{lastLogin.toLocaleDateString('vi-VN')}</div>
          <div className="text-xs text-gray-500">
            {lastLogin.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      );
    },
  },

  // ✅ Actions column
  {
    id: 'actions',
    cell: ({ row }) => <StaffActionsCell staff={row.original} />,
  },
];

// ✅ Actions Cell component
function StaffActionsCell({ staff }: { staff: Staff }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteStaff = useDeleteStaff();
  const updateStaff = useUpdateStaff();

  const handleCopyId = () => {
    navigator.clipboard.writeText(staff._id);
    toast.success('Staff ID copied to clipboard!');
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditDialogOpen(true);
  };

  const handleStatusClick = async () => {
    try {
      await updateStaff.mutateAsync({
        id: staff._id,
        data: { isActive: !staff.isActive },
      });
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleDeleteClick = async () => {
    try {
      await deleteStaff.mutateAsync(staff._id);
      setDeleteDialogOpen(false); // Close dialog on success
    } catch (error) {
      // Error is handled in the mutation hook
    }
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
            Edit staff
          </DropdownMenuItem>

          {/* ✅ Toggle Status action */}
          <DropdownMenuItem onClick={handleStatusClick}>
            {staff.isActive ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {staff.isActive ? 'Deactivate' : 'Activate'}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-500"
          >
            <Trash2 className="h-4 w-4" />
            Delete staff
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ✅ Edit Dialog */}
      <EditStaffDialog
        staff={staff}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      {/* ✅ Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the staff member "
              <strong>{staff.name}</strong>" and hide them from the list. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteStaff.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClick}
              disabled={deleteStaff.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteStaff.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
