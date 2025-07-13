import { useState, useEffect } from 'react';
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
import {
  AlertTriangle,
  Loader2,
  Trash2,
  Package,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeleteBreed } from '@/hooks/useBreeds';
import { breedService } from '@/services/breedService';
import type { Breed } from '@/types/breed';

interface DeleteBreedDialogProps {
  breed: Breed | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface BreedUsageStats {
  breed: Breed;
  petCount: number;
  samplePets: Array<{ _id: string; name: string }>;
  canDelete: boolean;
}

export function DeleteBreedDialog({
  breed,
  open,
  onOpenChange,
}: DeleteBreedDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [usageStats, setUsageStats] = useState<BreedUsageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const deleteBreed = useDeleteBreed();

  // Fetch detailed usage stats when dialog opens
  useEffect(() => {
    if (open && breed) {
      setLoading(true);
      breedService
        .getBreedUsageStats?.(breed._id)
        .then((response) => {
          setUsageStats(response.data);
        })
        .catch(() => {
          // Fallback to basic breed data
          setUsageStats({
            breed,
            petCount: breed.petCount || 0,
            samplePets: [],
            canDelete: (breed.petCount || 0) === 0,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, breed]);

  const handleDelete = async () => {
    if (!breed) return;

    setIsDeleting(true);
    try {
      await deleteBreed.mutateAsync(breed._id);
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

  if (!breed) return null;

  const canDelete = usageStats?.canDelete ?? breed.petCount === 0;
  const petCount = usageStats?.petCount ?? breed.petCount ?? 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Breed
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Are you sure you want to permanently delete the breed "
                <strong>{breed.name}</strong>"?
              </p>

              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <>
                  {/* Usage Statistics */}
                  <div className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Current Usage</span>
                      </div>
                      <Badge variant={canDelete ? 'secondary' : 'destructive'}>
                        {petCount} {petCount === 1 ? 'pet' : 'pets'}
                      </Badge>
                    </div>

                    {petCount > 0 && usageStats?.samplePets && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Pets using this breed:
                        </p>
                        <div className="space-y-1">
                          {usageStats.samplePets.map((pet) => (
                            <div
                              key={pet._id}
                              className="flex items-center justify-between rounded bg-gray-50 px-2 py-1 text-sm"
                            >
                              <span>{pet.name}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-1"
                                onClick={() =>
                                  window.open(
                                    `/staff/pets/${pet._id}`,
                                    '_blank',
                                  )
                                }
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        {petCount > 5 && (
                          <p className="text-xs text-gray-500">
                            And {petCount - 5} more pets...
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Warning or Info */}
                  {canDelete ? (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p className="font-medium">
                            This action cannot be undone.
                          </p>
                          <p className="text-sm">
                            The breed will be permanently removed from the
                            system. Since no pets are currently using this
                            breed, it's safe to delete.
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p className="font-medium">
                            Cannot delete this breed!
                          </p>
                          <p className="text-sm">
                            This breed is currently being used by {petCount}{' '}
                            {petCount === 1 ? 'pet' : 'pets'}. Please reassign
                            or delete these pets first, or consider deactivating
                            the breed instead.
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>

          {canDelete ? (
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting || deleteBreed.isPending || loading}
            >
              {isDeleting || deleteBreed.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Breed
                </>
              )}
            </AlertDialogAction>
          ) : (
            <Button variant="outline" disabled>
              Cannot Delete
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
