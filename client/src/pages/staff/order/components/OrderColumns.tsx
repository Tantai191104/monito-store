import type { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  Truck,
  Package,
} from 'lucide-react';

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
import type { Order } from '@/types/order';

// Helper function to get status badge variant
const getStatusVariant = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'confirmed':
      return 'default';
    case 'processing':
      return 'default';
    case 'shipped':
      return 'outline';
    case 'delivered':
      return 'default';
    case 'cancelled':
      return 'destructive';
    default:
      return 'secondary';
  }
};

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
      const customer = row.getValue('customer') as Order['customer'];
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
      const status = row.getValue('status') as Order['status'];
      return (
        <Badge variant={getStatusVariant(status)} className="capitalize">
          {status}
        </Badge>
      );
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
            <DropdownMenuItem className="flex items-center">
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
    },
  },
];
