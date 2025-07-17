import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Package } from 'lucide-react';
import { useState } from 'react';

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/types/order';
import { useUpdateOrderStatus } from '@/hooks/useOrders';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Helper function to get status badge variant
const getPaymentStatusVariant = (status: Order['paymentStatus']) => {
  switch (status) {
    case 'paid':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'failed':
      return 'destructive';
    case 'refunded':
      return 'outline';
    default:
      return 'secondary';
  }
};

// Status Change Cell Component with Confirmation
const StatusChangeCell = ({ order }: { order: Order }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Order['status'] | null>(null);
  const mutation = useUpdateOrderStatus();

  // Define available status transitions based on current status
  const getAvailableStatusOptions = (currentStatus: Order['status']) => {
    const allStatusOptions = [
      { value: 'pending', label: 'Pending' },
      { value: 'processing', label: 'Processing' },
      { value: 'delivered', label: 'Delivered' },
      { value: 'pending_refund', label: 'Pending Refund' },
      { value: 'refunded', label: 'Refunded' },
      { value: 'cancelled', label: 'Cancelled' },
    ];

    switch (currentStatus) {
      case 'pending':
        return allStatusOptions.filter(opt => 
          ['processing', 'cancelled'].includes(opt.value)
        );
      case 'processing':
        return allStatusOptions.filter(opt => 
          ['delivered'].includes(opt.value)
        );
      case 'pending_refund':
        return allStatusOptions.filter(opt => 
          ['refunded'].includes(opt.value)
        );
      case 'delivered':
      case 'refunded':
      case 'cancelled':
        return []; // No status changes allowed
      default:
        return [];
    }
  };

  const availableStatusOptions = getAvailableStatusOptions(order.status);
  const isStatusChangeDisabled = availableStatusOptions.length === 0;

  const handleStatusChange = (value: string) => {
    if (value === order.status) return; // No change needed

    setNewStatus(value as Order['status']);
    setIsConfirmOpen(true);
  };

  const confirmStatusChange = () => {
    if (!newStatus) return;

    mutation.mutate(
      { id: order._id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Order status updated to ${newStatus}`);
          setIsConfirmOpen(false);
          setNewStatus(null);
        },
        onError: () => {
          toast.error('Failed to update order status');
          setIsConfirmOpen(false);
          setNewStatus(null);
        },
      },
    );
  };

  const cancelStatusChange = () => {
    setIsConfirmOpen(false);
    setNewStatus(null);
  };

  return (
    <>
      <Select
        value={order.status}
        onValueChange={handleStatusChange}
        disabled={mutation.isPending || isStatusChangeDisabled}
      >
        <SelectTrigger className="w-[120px] capitalize">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {/* Show current status */}
          <SelectItem 
            key={order.status} 
            value={order.status} 
            className="capitalize"
          >
            {order.status.replace('_', ' ')} (Current)
          </SelectItem>
          {/* Show available status options */}
          {availableStatusOptions.map((opt: { value: string; label: string }) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="capitalize"
            >
              {opt.label}
            </SelectItem>
          ))}
          {/* Show message when no changes allowed */}
          {isStatusChangeDisabled && (
            <SelectItem 
              value="disabled" 
              disabled 
              className="text-gray-400 italic"
            >
              No changes allowed
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the order status from{' '}
              <span className="font-semibold capitalize">{order.status?.replace('_', ' ')}</span>{' '}
              to <span className="font-semibold capitalize">{newStatus?.replace('_', ' ')}</span>?
              <br />
              <br />
              <div className="bg-blue-50 p-3 rounded-md mt-2">
                <p className="text-sm text-blue-800 font-medium">Status Flow:</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Pending → Processing or Cancelled</li>
                  <li>• Processing → Delivered</li>
                  <li>• Pending Refund → Refunded</li>
                  <li>• Delivered/Refunded/Cancelled → No changes allowed</li>
                </ul>
              </div>
              <br />
              <span className="text-sm text-gray-600">
                Order: {order.orderNumber}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelStatusChange}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusChange}
              disabled={mutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {mutation.isPending ? 'Updating...' : 'Confirm Change'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Add wrapper component for Actions cell
const OrderActionsCell = ({ order }: { order: Order }) => {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(order.orderNumber)}
        >
          Copy order number
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center"
          onClick={() => navigate(`/staff/orders/${order._id}`)}
        >
          <Eye className="h-4 w-4" />
          View details
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center">
          <Edit className="h-4 w-4" />
          Edit order
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center">
          <Package className="h-4 w-4" />
          Update status
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const orderColumns: ColumnDef<Order>[] = [
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
    accessorKey: 'orderNumber',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Order Number
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium text-blue-600">
          {row.getValue('orderNumber')}
        </div>
      );
    },
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
      const customer = row.getValue('customer') as Order['customer'] | null;
      if (!customer) {
        return (
          <div className="max-w-[200px] text-gray-400 italic">
            No customer info
          </div>
        );
      }
      return (
        <div className="max-w-[200px]">
          <div className="font-medium">{customer.name}</div>
          <div className="text-sm text-gray-500">{customer.email}</div>
          {customer.phone && (
            <div className="text-xs text-gray-400">{customer.phone}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'items',
    header: 'Items',
    cell: ({ row }) => {
      const items = row.getValue('items') as Order['items'];
      const totalItems = row.original.totalItems;

      return (
        <div className="text-center">
          <div className="font-medium">{totalItems}</div>
          <div className="text-xs text-gray-500">
            {items.length} product{items.length !== 1 ? 's' : ''}
          </div>
          <div className="mt-1 flex items-center justify-center space-x-1">
            {items.some((item) => item.type === 'pet') && (
              <div
                className="h-2 w-2 rounded-full bg-red-500"
                title="Contains pets"
              />
            )}
            {items.some((item) => item.type === 'product') && (
              <div
                className="h-2 w-2 rounded-full bg-blue-500"
                title="Contains products"
              />
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'total',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const total = parseFloat(row.getValue('total'));
      const subtotal = row.original.subtotal;
      const shipping = row.original.shipping;
      const tax = row.original.tax;

      return (
        <div className="text-right">
          <div className="text-lg font-medium">
            {total.toLocaleString('vi-VN')} ₫
          </div>
          <div className="text-xs text-gray-500">
            Subtotal: {subtotal.toLocaleString('vi-VN')} ₫
          </div>
          {shipping > 0 && (
            <div className="text-xs text-gray-500">
              Shipping: {shipping.toLocaleString('vi-VN')} ₫
            </div>
          )}
          {tax > 0 && (
            <div className="text-xs text-gray-500">
              Tax: {tax.toLocaleString('vi-VN')} ₫
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Order Status',
    cell: ({ row }) => {
      return <StatusChangeCell order={row.original} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment',
    cell: ({ row }) => {
      const paymentStatus = row.getValue(
        'paymentStatus',
      ) as Order['paymentStatus'];
      return (
        <Badge
          variant={getPaymentStatusVariant(paymentStatus)}
          className="capitalize"
        >
          {paymentStatus}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'shippingAddress',
    header: 'Shipping Location',
    cell: ({ row }) => {
      const address = row.getValue(
        'shippingAddress',
      ) as Order['shippingAddress'];
      return (
        <div className="max-w-[150px] text-sm">
          <div>{address.city}</div>
          <div className="text-xs text-gray-500">{address.state}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'orderDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Order Date
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const orderDate = new Date(row.getValue('orderDate'));
      const estimatedDelivery = row.original.estimatedDelivery;

      return (
        <div className="text-sm">
          <div className="font-medium">
            {orderDate.toLocaleDateString('vi-VN')}
          </div>
          <div className="text-xs text-gray-500">
            {orderDate.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
          {estimatedDelivery && (
            <div className="mt-1 text-xs text-blue-600">
              Est: {new Date(estimatedDelivery).toLocaleDateString('vi-VN')}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const order = row.original;
      return <OrderActionsCell order={order} />;
    },
  },
];
