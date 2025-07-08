import * as React from 'react';
import type { Table } from '@tanstack/react-table';
import { ChevronDown, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterControls: React.ReactNode;
  addHref: string;
  addLabel: string;
}

export function DataTableToolbar<TData>({
  table,
  filterControls,
  addHref,
  addLabel,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      {/* Left side: Filters */}
      <div className="flex flex-1 items-center space-x-2">
        {filterControls}
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-auto h-4 w-4" />
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

        <Button asChild>
          <Link to={addHref}>
            <Plus className="mr-2 h-4 w-4" />
            {addLabel}
          </Link>
        </Button>
      </div>
    </div>
  );
}