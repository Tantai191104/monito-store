import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';

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
import type { Pet } from '@/types/pet';

export const petColumns: ColumnDef<Pet>[] = [
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
      const name = row.getValue('name') as string;
      return (
        <div className="flex items-center">
          {images && images.length > 0 ? (
            <img
              src={images[0]}
              alt={name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
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
      const pet = row.original;
      return (
        <div className="max-w-[200px]">
          <div className="font-medium">{row.getValue('name')}</div>
          <div className="text-sm text-gray-500">
            {pet.gender} • {pet.age}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'breed',
    header: 'Breed',
    cell: ({ row }) => {
      const breed = row.getValue('breed') as Pet['breed'];
      return <Badge variant="secondary">{breed.name}</Badge>;
    },
  },
  {
    accessorKey: 'color',
    header: 'Color',
    cell: ({ row }) => {
      const color = row.getValue('color') as Pet['color'];
      return (
        <div className="flex items-center space-x-2">
          <div
            className="h-4 w-4 rounded-full border"
            style={{ backgroundColor: color.hexCode }}
          />
          <span className="text-sm">{color.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'size',
    header: 'Size',
    cell: ({ row }) => {
      const size = row.getValue('size') as string;
      const variant =
        size === 'Large'
          ? 'default'
          : size === 'Medium'
            ? 'secondary'
            : 'outline';
      return <Badge variant={variant}>{size}</Badge>;
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
      return (
        <div className="text-right font-medium">
          {price.toLocaleString('vi-VN')} ₫
        </div>
      );
    },
  },
  {
    accessorKey: 'health',
    header: 'Health',
    cell: ({ row }) => {
      const pet = row.original;
      const healthScore = [
        pet.isVaccinated,
        pet.isDewormed,
        pet.hasCert,
        pet.hasMicrochip,
      ].filter(Boolean).length;

      return (
        <div className="text-center">
          <div className="text-sm font-medium">{healthScore}/4</div>
          <div className="text-xs text-gray-500">
            {pet.isVaccinated && '💉'} {pet.isDewormed && '🪱'}
            {pet.hasCert && '📋'} {pet.hasMicrochip && '🔗'}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue('location')}</div>;
    },
  },
  {
    accessorKey: 'isAvailable',
    header: 'Status',
    cell: ({ row }) => {
      const isAvailable = row.getValue('isAvailable') as boolean;
      return (
        <Badge variant={isAvailable ? 'default' : 'destructive'}>
          {isAvailable ? 'Available' : 'Sold'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'publishedDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Published
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('publishedDate'));
      return <div className="text-sm">{date.toLocaleDateString('vi-VN')}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const pet = row.original;

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
              onClick={() => navigator.clipboard.writeText(pet._id)}
            >
              Copy pet ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center">
              <Eye className="h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center">
              <Edit className="h-4 w-4" />
              Edit pet
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center text-red-600">
              <Trash2 className="h-4 w-4" />
              Delete pet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
