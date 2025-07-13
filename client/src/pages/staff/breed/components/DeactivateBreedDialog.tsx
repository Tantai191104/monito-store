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
import { AlertTriangle, Loader2, Eye, EyeOff, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUpdateBreed } from '@/hooks/useBreeds';
import type { Breed } from '@/types/breed';

interface DeactivateBreedDialogProps {
  breed: Breed | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeactivateBreedDialog({
  breed,
  open,
  onOpenChange,
}: DeactivateBreedDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const updateBreed = useUpdateBreed();

  const handleToggleStatus = async () => {
    if (!breed) return;

    setIsUpdating(true);
    try {
      await updateBreed.mutateAsync({
        id: breed._id,
        data: { isActive: !breed.isActive },
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

  if (!breed) return null;

  const isDeactivating = breed.isActive;
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
            {isDeactivating ? 'Deactivate' : 'Activate'} Breed
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you want to {action} the breed "
                <strong>{breed.name}</strong>"?
              </p>

              {/* Pet Count Information */}
              {breed.petCount > 0 && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Package className="h-4 w-4" />
                    <span className="font-medium">
                      {breed.petCount} {breed.petCount === 1 ? 'pet' : 'pets'}{' '}
                      using this breed
                    </span>
                  </div>
                </div>
              )}

              {isDeactivating ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">
                        What happens when you deactivate:
                      </p>
                      <ul className="list-inside list-disc space-y-1 text-sm">
                        <li>Breed will be hidden from pet creation forms</li>
                        <li>Breed won't appear in customer filters</li>
                        <li>Existing pets keep their breed assignment</li>
                        <li>Pets remain visible and functional</li>
                        <li>You can reactivate this breed anytime</li>
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
                        <li>Breed will appear in pet creation forms</li>
                        <li>Breed will be available in customer filters</li>
                        <li>Staff can assign pets to this breed</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Status badge */}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm font-medium">Current Status:</span>
                <Badge variant={breed.isActive ? 'default' : 'secondary'}>
                  {breed.isActive ? 'Active' : 'Inactive'}
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
            disabled={isUpdating || updateBreed.isPending}
          >
            {isUpdating || updateBreed.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isDeactivating ? 'Deactivating...' : 'Activating...'}
              </>
            ) : (
              `${isDeactivating ? 'Deactivate' : 'Activate'} Breed`
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
