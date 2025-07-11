import { useState } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Package, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useDeleteCategory,
  useCategoryUsageStats,
} from '@/hooks/useCategories';
import type { Category } from '@/types/category';

interface DeleteCategoryDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCategoryDialog({
  category,
  open,
  onOpenChange,
}: DeleteCategoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteCategory = useDeleteCategory();

  // ✅ Fetch usage stats when dialog opens
  const {
    data: usageStats,
    isLoading: statsLoading,
    error: statsError,
  } = useCategoryUsageStats(category?._id || '');

  const handleDelete = async () => {
    if (!category || !usageStats?.canDelete) return;

    setIsDeleting(true);
    try {
      await deleteCategory.mutateAsync(category._id);
      onOpenChange(false);
    } catch (error) {
      // Error handled in mutation
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!category) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Delete Category
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you want to delete the category "
                <strong>{category.name}</strong>"?
              </p>

              {/* ✅ Show usage statistics */}
              {statsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : statsError ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Failed to load category usage information.
                  </AlertDescription>
                </Alert>
              ) : usageStats ? (
                <div className="space-y-3">
                  {/* Usage Status */}
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">
                        Products using this category:
                      </span>
                    </div>
                    <Badge
                      variant={
                        usageStats.canDelete ? 'secondary' : 'destructive'
                      }
                    >
                      {usageStats.productCount}
                    </Badge>
                  </div>

                  {/* Warning if category is in use */}
                  {!usageStats.canDelete && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p>
                            This category cannot be deleted because it's being
                            used by <strong>{usageStats.productCount}</strong>{' '}
                            product(s).
                          </p>

                          {usageStats.sampleProducts.length > 0 && (
                            <div>
                              <p className="font-medium">Sample products:</p>
                              <ul className="mt-1 list-inside list-disc space-y-1 text-xs">
                                {usageStats.sampleProducts.map((product) => (
                                  <li
                                    key={product._id}
                                    className="flex items-center justify-between"
                                  >
                                    <span>{product.name}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-auto p-1"
                                      onClick={() => {
                                        // Navigate to product detail
                                        window.open(
                                          `/staff/products/${product._id}`,
                                          '_blank',
                                        );
                                      }}
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                              {usageStats.productCount >
                                usageStats.sampleProducts.length && (
                                <p className="mt-1 text-xs text-gray-600">
                                  ...and{' '}
                                  {usageStats.productCount -
                                    usageStats.sampleProducts.length}{' '}
                                  more
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Success message if safe to delete */}
                  {usageStats.canDelete && (
                    <Alert>
                      <AlertDescription>
                        This category is not being used by any products and can
                        be safely deleted.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : null}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>

          {/* ✅ Only show delete button if category can be deleted */}
          {usageStats?.canDelete && (
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting || deleteCategory.isPending}
            >
              {isDeleting || deleteCategory.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Category'
              )}
            </AlertDialogAction>
          )}

          {/* ✅ Show action button for categories in use */}
          {usageStats && !usageStats.canDelete && (
            <Button
              variant="outline"
              onClick={() => {
                // Navigate to products filtered by this category
                window.open(
                  `/staff/products?category=${category.name}`,
                  '_blank',
                );
                onOpenChange(false);
              }}
            >
              View Products
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
