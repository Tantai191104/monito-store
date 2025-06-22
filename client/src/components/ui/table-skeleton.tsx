import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export function TableSkeleton({
  rows = 10,
  columns = 6,
  showHeader = true,
}: TableSkeletonProps) {
  return (
    <div className="w-full space-y-4">
      {/* Toolbar Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-10 w-[140px]" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border">
        <Table>
          {showHeader && (
            <TableHeader>
              <TableRow>
                {Array.from({ length: columns }).map((_, index) => (
                  <TableHead key={index}>
                    <Skeleton className="h-4 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    {colIndex === 0 ? (
                      // First column - checkbox + name
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-4 w-4" />
                        <div>
                          <Skeleton className="mb-1 h-4 w-[120px]" />
                          <Skeleton className="h-3 w-[80px]" />
                        </div>
                      </div>
                    ) : colIndex === 1 ? (
                      // Second column - description
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                    ) : colIndex === 2 ? (
                      // Third column - status badge
                      <Skeleton className="h-6 w-[60px] rounded-full" />
                    ) : colIndex === columns - 2 ? (
                      // Date columns
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-[80px]" />
                        <Skeleton className="h-3 w-[60px]" />
                      </div>
                    ) : colIndex === columns - 1 ? (
                      // Actions column
                      <Skeleton className="h-8 w-8 rounded-md" />
                    ) : (
                      // Default column
                      <Skeleton className="h-4 w-[100px]" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between space-x-2 pb-4">
        <Skeleton className="h-4 w-[200px]" />
        <div className="flex items-center gap-5">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-8 w-[70px]" />
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="h-8 w-[80px]" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-[80px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
