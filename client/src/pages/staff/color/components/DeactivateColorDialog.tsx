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
import { useUpdateColor } from '@/hooks/useColors';
import type { Color } from '@/types/color';

interface DeactivateColorDialogProps {
  color: Color | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeactivateColorDialog({
  color,
  open,
  onOpenChange,
}: DeactivateColorDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const updateColor = useUpdateColor();

  const handleToggleStatus = async () => {
    if (!color) return;

    setIsUpdating(true);
    try {
      await updateColor.mutateAsync({
        id: color._id,
        data: { isActive: !color.isActive },
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

  if (!color) return null;

  const isDeactivating = color.isActive;
  const action = isDeactivating ? 'deactivate' : 'activate';

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
            {isDeactivating ? 'Deactivate' : 'Activate'} Color
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <p>
                  Are you sure you want to {action} the color "
                  <strong>{color.name}</strong>"?
                </p>
              </div>

              {/* Pet Count Information */}
              {color.petCount && color.petCount > 0 && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Package className="h-4 w-4" />
                    <span className="font-medium">
                      {color.petCount} {color.petCount === 1 ? 'pet' : 'pets'}{' '}
                      using this color
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
                        <li>Color will be hidden from pet creation forms</li>
                        <li>Color won't appear in customer filters</li>
                        <li>Existing pets keep their color assignment</li>
                        <li>Pets remain visible and functional</li>
                        <li>You can reactivate this color anytime</li>
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
                        <li>Color will appear in pet creation forms</li>
                        <li>Color will be available in customer filters</li>
                        <li>Staff can assign pets to this color</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Status badge */}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm font-medium">Current Status:</span>
                <Badge variant={color.isActive ? 'default' : 'secondary'}>
                  {color.isActive ? 'Active' : 'Inactive'}
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
            disabled={isUpdating || updateColor.isPending}
          >
            {isUpdating || updateColor.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isDeactivating ? 'Deactivating...' : 'Activating...'}
              </>
            ) : (
              `${isDeactivating ? 'Deactivate' : 'Activate'} Color`
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
