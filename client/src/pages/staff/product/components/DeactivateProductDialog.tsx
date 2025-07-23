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
import { AlertTriangle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useToggleProductStatus } from '@/hooks/useProducts';
import type { Product } from '@/types/product';

interface DeactivateProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeactivateProductDialog({
  product,
  open,
  onOpenChange,
}: DeactivateProductDialogProps) {
  const toggleStatus = useToggleProductStatus();

  const handleToggleStatus = async () => {
    if (!product) return;
    toggleStatus.mutate(
      { id: product._id, isActive: !product.isActive },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  if (!product) return null;

  const isDeactivating = product.isActive;
  const action = isDeactivating ? 'deactivate' : 'activate';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isDeactivating ? <EyeOff /> : <Eye />}
            {action.charAt(0).toUpperCase() + action.slice(1)} Product
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Are you sure you want to {action} the product "
                <strong>{product.name}</strong>"?
              </p>
              {isDeactivating ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Deactivating will hide this product from customers, but it
                    will remain in past orders.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertDescription>
                    Activating will make this product visible and available for
                    purchase again.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={toggleStatus.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleToggleStatus}
            disabled={toggleStatus.isPending}
            className={
              isDeactivating
                ? 'bg-orange-600 hover:bg-orange-700'
                : 'bg-green-600 hover:bg-green-700'
            }
          >
            {toggleStatus.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {action.charAt(0).toUpperCase() + action.slice(1)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
