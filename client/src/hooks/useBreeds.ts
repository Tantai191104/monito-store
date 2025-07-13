import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { breedService } from '@/services/breedService';
import type {
  CreateBreedPayload,
  UpdateBreedPayload,
  Breed,
} from '@/types/breed';
import type { ApiError } from '@/types/api';
import { getErrorMessage } from '@/utils/errorHandler';

export const breedKeys = {
  all: ['breeds'] as const,
  lists: () => [...breedKeys.all, 'list'] as const,
  list: (filters: string) => [...breedKeys.lists(), { filters }] as const,
  details: () => [...breedKeys.all, 'detail'] as const,
  detail: (id: string) => [...breedKeys.details(), id] as const,
};

// Get all breeds
export const useBreeds = (params: URLSearchParams = new URLSearchParams()) => {
  return useQuery({
    queryKey: ['breeds', params.toString()],
    queryFn: async () => {
      const response = await breedService.getBreeds(params);
      const breeds = response.data || [];

      // ✅ Ensure petCount is always a number
      return breeds.map((breed) => ({
        ...breed,
        petCount: breed.petCount || 0,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Get only active breeds for pet forms
export const useActiveBreeds = () => {
  return useQuery({
    queryKey: [...breedKeys.lists(), 'active'],
    queryFn: async () => {
      const response = await breedService.getBreeds();
      const breeds = response.data || [];
      return breeds
        .filter((breed) => breed.isActive)
        .map((breed) => ({
          ...breed,
          petCount: breed.petCount || 0,
        }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Get single breed by ID
export const useBreed = (id: string) => {
  return useQuery({
    queryKey: breedKeys.detail(id),
    queryFn: async () => {
      const response = await breedService.getBreedById(id);
      return response.data?.breed;
    },
    enabled: !!id,
  });
};

// Create breed mutation
export const useCreateBreed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBreedPayload) => breedService.createBreed(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: breedKeys.all });
      const newBreed = response.data?.breed;
      if (newBreed) {
        // ✅ Fix: Add to BEGINNING of list with petCount = 0
        queryClient.setQueryData(breedKeys.lists(), (old: Breed[] = []) => [
          { ...newBreed, petCount: 0 }, // ✅ Add at beginning
          ...old,
        ]);

        // ✅ Also update the main query key
        queryClient.setQueryData(['breeds', ''], (old: Breed[] = []) => [
          { ...newBreed, petCount: 0 },
          ...old,
        ]);
      }
      toast.success('Breed created successfully!');
      return newBreed;
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Update breed mutation
export const useUpdateBreed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBreedPayload }) =>
      breedService.updateBreed(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: breedKeys.all });

      const updatedBreed = response.data?.breed;
      if (updatedBreed) {
        // ✅ Update the breed in all relevant queries
        queryClient.setQueryData(breedKeys.lists(), (old: Breed[] = []) =>
          old.map((breed) =>
            breed._id === id
              ? { ...updatedBreed, petCount: breed.petCount }
              : breed,
          ),
        );

        // ✅ Update main query key
        queryClient.setQueryData(['breeds', ''], (old: Breed[] = []) =>
          old.map((breed) =>
            breed._id === id
              ? { ...updatedBreed, petCount: breed.petCount }
              : breed,
          ),
        );

        // ✅ Update individual breed query
        queryClient.setQueryData(breedKeys.detail(id), {
          data: { breed: updatedBreed },
        });
      }

      toast.success('Breed updated successfully!');
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Delete breed mutation
export const useDeleteBreed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => breedService.deleteBreed(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(breedKeys.lists(), (old: Breed[] = []) =>
        old.filter((breed) => breed._id !== deletedId),
      );

      queryClient.removeQueries({ queryKey: breedKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: breedKeys.all });

      toast.success('Breed deleted successfully!');
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;

      // ✅ Handle specific constraint violation error
      if (apiError?.errorCode === 'BREED_IN_USE') {
        toast.error(apiError.message, {
          description: 'Please reassign or delete pets using this breed first.',
          duration: 6000,
        });
      } else {
        const message = getErrorMessage(apiError?.errorCode, apiError?.message);
        toast.error(message);
      }
    },
  });
};

// Bulk operations
export const useBulkActivateBreeds = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(
        ids.map((id) => breedService.updateBreed(id, { isActive: true })),
      );
      return ids;
    },
    onSuccess: (activatedIds) => {
      queryClient.setQueryData(breedKeys.lists(), (old: Breed[] = []) =>
        old.map((breed) =>
          activatedIds.includes(breed._id)
            ? { ...breed, isActive: true }
            : breed,
        ),
      );
      queryClient.invalidateQueries({ queryKey: breedKeys.all });
      toast.success(`${activatedIds.length} breeds activated successfully!`);
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

export const useBulkDeactivateBreeds = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(
        ids.map((id) => breedService.updateBreed(id, { isActive: false })),
      );
      return ids;
    },
    onSuccess: (deactivatedIds) => {
      queryClient.setQueryData(breedKeys.lists(), (old: Breed[] = []) =>
        old.map((breed) =>
          deactivatedIds.includes(breed._id)
            ? { ...breed, isActive: false }
            : breed,
        ),
      );
      queryClient.invalidateQueries({ queryKey: breedKeys.all });
      toast.success(
        `${deactivatedIds.length} breeds deactivated successfully!`,
      );
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// ✅ Enhanced bulk delete with constraint handling
export const useBulkDeleteBreeds = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => breedService.deleteBreed(id)));
      return ids;
    },
    onSuccess: (deletedIds) => {
      queryClient.setQueryData(breedKeys.lists(), (old: Breed[] = []) =>
        old.filter((breed) => !deletedIds.includes(breed._id)),
      );

      deletedIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: breedKeys.detail(id) });
      });

      queryClient.invalidateQueries({ queryKey: breedKeys.all });
      toast.success(`${deletedIds.length} breeds deleted successfully!`);
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;

      // ✅ Handle constraint violations
      if (apiError?.errorCode === 'BREED_IN_USE') {
        toast.error('Some breeds cannot be deleted', {
          description: 'They are being used by pets.',
          duration: 6000,
        });
      } else {
        const message = getErrorMessage(apiError?.errorCode, apiError?.message);
        toast.error(message);
      }
    },
  });
};
