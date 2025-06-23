import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { petService } from '@/services/petService';
import type {
  CreatePetPayload,
  UpdatePetPayload,
  Pet,
} from '@/types/pet';
import type { ApiError } from '@/types/api';
import { getErrorMessage } from '@/utils/errorHandler';

export const petKeys = {
  all: ['pets'] as const,
  lists: () => [...petKeys.all, 'list'] as const,
  list: (filters: string) => [...petKeys.lists(), { filters }] as const,
  details: () => [...petKeys.all, 'detail'] as const,
  detail: (id: string) => [...petKeys.details(), id] as const,
};

export const usePets = () => {
  return useQuery({
    queryKey: petKeys.lists(),
    queryFn: async () => {
      const response = await petService.getPets();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

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

export const useCreatePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePetPayload) => petService.createPet(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: petKeys.all });
      const newPet = response.data?.pet;
      if (newPet) {
        queryClient.setQueryData(
          petKeys.lists(),
          (old: Pet[] = []) => [newPet, ...old],
        );
      }
      toast.success('Pet created successfully!');
      return newPet;
    },
    onError: (error: unknown) => {
      const apiError = (error as any).response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

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
    onError: (error: unknown) => {
      const apiError = (error as any).response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

export const useDeletePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => petService.deletePet(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(petKeys.lists(), (old: Pet[] = []) =>
        old.filter((pet) => pet._id !== deletedId),
      );
      queryClient.removeQueries({ queryKey: petKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: petKeys.all });
      toast.success('Pet deleted successfully!');
    },
    onError: (error: unknown) => {
      const apiError = (error as any).response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

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
    onError: (error: unknown) => {
      const apiError = (error as any).response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
}; 