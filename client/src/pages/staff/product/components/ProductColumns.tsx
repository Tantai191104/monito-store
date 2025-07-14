import type { ColumnDef, RowData } from '@tanstack/react-table';
import {
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  EyeOff,
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
import { DeactivateProductDialog } from './DeactivateProductDialog'; // ✅ Import
import { DeleteProductDialog } from './DeleteProductDialog'; // ✅ Import
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types/product';
import { useState } from 'react';

// Add this declaration to extend the table's meta type
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    requestDelete?: (product: TData) => void;
  }
}

function ProductActionsCell({ product }: { product: Product }) {
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
          <DropdownMenuItem asChild>
            <Link to={`/staff/products/${product._id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/staff/products/${product._id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* ✅ Activate/Deactivate Action */}
          <DropdownMenuItem onClick={() => setDeactivateDialogOpen(true)}>
            {product.isActive ? (
              <EyeOff className="mr-2 h-4 w-4" />
            ) : (
              <Eye className="mr-2 h-4 w-4" />
            )}
            {product.isActive ? 'Deactivate' : 'Activate'}
          </DropdownMenuItem>
          {/* ✅ Delete Action */}
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ✅ Dialogs */}
      <DeactivateProductDialog
        product={product}
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
      />
      <DeleteProductDialog
        product={product}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}

export const productColumns: ColumnDef<Product>[] = [
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
    accessorKey: 'images',
    header: 'Image',
    cell: ({ row }) => {
      const images = row.getValue('images') as string[];
      return (
        <div className="flex items-center">
          {images && images.length > 0 ? (
            <img
              src={images[0]}
              alt={row.getValue('name')}
              className="h-10 w-10 rounded-md object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
              <span className="text-xs text-gray-400">No img</span>
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
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
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px]">
          <div className="font-medium">{row.getValue('name')}</div>
          <div className="text-sm text-gray-500">
            Brand: {row.original.brand}
          </div>
        </div>
      );
    },
  },
  {
    id: 'category',
    accessorFn: (row) => row.category?.name, // ✅ FIX: Truy cập vào tên category để lọc
    header: 'Category',
    cell: ({ row }) => {
      const category = row.original.category;
      return <Badge variant="secondary">{category.name}</Badge>;
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const originalPrice = row.original.originalPrice;
      const discount = row.original.discount;

      return (
        <div className="text-right">
          <div className="font-medium">{price.toLocaleString('vi-VN')} ₫</div>
          {originalPrice && discount && (
            <div className="text-sm text-gray-500">
              <span className="line-through">
                {originalPrice.toLocaleString('vi-VN')} ₫
              </span>
              <Badge variant="destructive" className="ml-1 text-xs">
                -{discount}%
              </Badge>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Stock
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const stock = row.getValue('stock') as number;
      const isInStock = row.original.isInStock;

      return (
        <div className="text-center">
          <div className="font-medium">{stock}</div>
          <Badge
            variant={isInStock ? 'default' : 'destructive'}
            className="text-xs"
          >
            {isInStock ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => {
      const rating = row.getValue('rating') as number;
      const reviewCount = row.original.reviewCount;

      return (
        <div className="text-center">
          <div className="font-medium">⭐ {rating}</div>
          <div className="text-sm text-gray-500">({reviewCount} reviews)</div>
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
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
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
      return <div className="text-sm">{date.toLocaleDateString('vi-VN')}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const product = row.original;
      return <ProductActionsCell product={product} />;
    },
  },
];
