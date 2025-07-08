import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { petService } from '@/services/petService';
import type { CreatePetPayload, UpdatePetPayload, Pet } from '@/types/pet';
import type { ApiError } from '@/types/api';
import { getErrorMessage } from '@/utils/errorHandler';

export const petKeys = {
  all: ['pets'] as const,
  lists: () => [...petKeys.all, 'list'] as const,
  list: (filters: string) => [...petKeys.lists(), { filters }] as const,
  details: () => [...petKeys.all, 'detail'] as const,
  detail: (id: string) => [...petKeys.details(), id] as const,
};

// Get all pets
export const usePets = (params: URLSearchParams = new URLSearchParams()) => {
  // ✅ FIX: Flatten the query key to ensure invalidation works correctly.
  // The key should be a flat array, not a nested one.
  return useQuery({
    queryKey: petKeys.list(params.toString()),
    queryFn: async () => {
      const response = await petService.getPets(params);
      return response.data; // Return the data object { pets, pagination }
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Get single pet by ID
export const usePet = (id: string) => {
  return useQuery({
    queryKey: petKeys.detail(id),
    queryFn: async () => {
      const response = await petService.getPetById(id);
      return response.data?.pet;
    },
    enabled: !!id,
  });
};

// Create pet mutation
export const useCreatePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePetPayload) => petService.createPet(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: petKeys.all });
      const newPet = response.data?.pet;
      if (newPet) {
        queryClient.setQueryData(petKeys.lists(), (old: Pet[] = []) => [
          newPet,
          ...old,
        ]);
      }
      toast.success('Pet created successfully!');
      return newPet;
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Update pet mutation
export const useUpdatePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePetPayload }) =>
      petService.updatePet(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: petKeys.all });
      const updatedPet = response.data?.pet;
      if (updatedPet) {
        queryClient.setQueryData(petKeys.detail(id), updatedPet);
        queryClient.setQueryData(petKeys.lists(), (old: Pet[] = []) =>
          old.map((pet) => (pet._id === id ? updatedPet : pet)),
        );
      }
      toast.success('Pet updated successfully!');
      return updatedPet;
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Update pet availability
export const useUpdatePetAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      petService.updateAvailability(id, isAvailable),
    onSuccess: (response, { id }) => {
      // ✅ FIX: Invalidate list queries to trigger a refetch for the table
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });

      const updatedPet = response.data?.pet;
      if (updatedPet) {
        // This part is good, it updates the detail view cache
        queryClient.setQueryData(petKeys.detail(id), updatedPet);
      }
      toast.success('Pet availability updated successfully!');
      return updatedPet;
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Delete pet mutation
export const useDeletePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => petService.deletePet(id),
    onSuccess: (_, deletedId) => {
      // ✅ FIX: Invalidate list queries to trigger a refetch for the table
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
      queryClient.removeQueries({ queryKey: petKeys.detail(deletedId) });
      toast.success('Pet deleted successfully!');
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Bulk operations
export const useBulkDeletePets = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => petService.deletePet(id)));
      return ids;
    },
    onSuccess: (deletedIds) => {
      queryClient.setQueryData(petKeys.lists(), (old: Pet[] = []) =>
        old.filter((pet) => !deletedIds.includes(pet._id)),
      );
      deletedIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: petKeys.detail(id) });
      });
      queryClient.invalidateQueries({ queryKey: petKeys.all });
      toast.success(`${deletedIds.length} pets deleted successfully!`);
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Bulk update availability
export const useBulkUpdatePetAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      ids,
      isAvailable,
    }: {
      ids: string[];
      isAvailable: boolean;
    }) => {
      const results = await Promise.all(
        ids.map((id) => petService.updateAvailability(id, isAvailable)),
      );
      return {
        ids,
        isAvailable,
        pets: results.map((r) => r.data?.pet).filter(Boolean),
      };
    },
    onSuccess: ({ ids, isAvailable, pets }) => {
      // ✅ FIX: Invalidate list queries to trigger a refetch for the table
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });

      // Update detail caches for each affected pet
      pets.forEach((pet) => {
        if (pet) {
          queryClient.setQueryData(petKeys.detail(pet._id), pet);
        }
      });

      const action = isAvailable ? 'made available' : 'marked as sold';
      toast.success(`${ids.length} pets ${action} successfully!`);
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};
