
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
import { AlertTriangle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useUpdateCategory } from '@/hooks/useCategories';
import type { Category } from '@/types/category';

interface DeactivateCategoryDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeactivateCategoryDialog({
  category,
  open,
  onOpenChange,
}: DeactivateCategoryDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const updateCategory = useUpdateCategory();

  const handleToggleStatus = async () => {
    if (!category) return;

    setIsUpdating(true);
    try {
      await updateCategory.mutateAsync({
        id: category._id,
        data: { isActive: !category.isActive },
      });
      onOpenChange(false);
    } catch (error) {
      // Error handled in mutation
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!category) return null;

  const isDeactivating = category.isActive;
  const action = isDeactivating ? 'deactivate' : 'activate';
  const actionPast = isDeactivating ? 'deactivated' : 'activated';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isDeactivating ? (
              <EyeOff className="h-5 w-5 text-orange-600" />
            ) : (
              <Eye className="h-5 w-5 text-green-600" />
            )}
            {isDeactivating ? 'Deactivate' : 'Activate'} Category
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you want to {action} the category "
                <strong>{category.name}</strong>"?
              </p>

              {isDeactivating ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">
                        What happens when you deactivate:
                      </p>
                      <ul className="list-inside list-disc space-y-1 text-sm">
                        <li>
                          Category will be hidden from product creation forms
                        </li>
                        <li>Category won't appear in customer filters</li>
                        <li>
                          Existing products keep their category assignment
                        </li>
                        <li>Products remain visible and functional</li>
                        <li>You can reactivate this category anytime</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">
                        What happens when you activate:
                      </p>
                      <ul className="list-inside list-disc space-y-1 text-sm">
                        <li>Category will appear in product creation forms</li>
                        <li>Category will be available in customer filters</li>
                        <li>Staff can assign products to this category</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Status badge */}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm font-medium">Current Status:</span>
                <Badge variant={category.isActive ? 'default' : 'secondary'}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleToggleStatus}
            className={
              isDeactivating
                ? 'bg-orange-600 hover:bg-orange-700'
                : 'bg-green-600 hover:bg-green-700'
            }
            disabled={isUpdating || updateCategory.isPending}
          >
            {isUpdating || updateCategory.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isDeactivating ? 'Deactivating...' : 'Activating...'}
              </>
            ) : (
              `${isDeactivating ? 'Deactivate' : 'Activate'} Category`
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
