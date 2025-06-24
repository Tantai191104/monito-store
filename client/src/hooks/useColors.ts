import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Services
 */
import { colorService } from '@/services/colorService';

/**
 * Types
 */
import type {
  CreateColorPayload,
  UpdateColorPayload,
  Color,
} from '@/types/color';
import type { ApiError } from '@/types/api';

/**
 * Utils
 */
import { getErrorMessage } from '@/utils/errorHandler';

// Query keys for better cache management
export const colorKeys = {
  all: ['colors'] as const,
  lists: () => [...colorKeys.all, 'list'] as const,
  list: (filters: string) => [...colorKeys.lists(), { filters }] as const,
  details: () => [...colorKeys.all, 'detail'] as const,
  detail: (id: string) => [...colorKeys.details(), id] as const,
};

// Get all colors
export const useColors = () => {
  return useQuery({
    queryKey: colorKeys.lists(),
    queryFn: async () => {
      const response = await colorService.getColors();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single color by ID
export const useColor = (id: string) => {
  return useQuery({
    queryKey: colorKeys.detail(id),
    queryFn: async () => {
      const response = await colorService.getColorById(id);
      return response.data?.color;
    },
    enabled: !!id,
  });
};

// Create color mutation
export const useCreateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateColorPayload) => colorService.createColor(data),
    onSuccess: (response) => {
      // Invalidate and refetch colors
      queryClient.invalidateQueries({ queryKey: colorKeys.all });
      
      // Optional: Update cache optimistically
      const newColor = response.data?.color;
      if (newColor) {
        queryClient.setQueryData(colorKeys.lists(), (old: Color[] = []) => [
          newColor,
          ...old
        ]);
      }
      
      toast.success('Color created successfully!');
      return newColor;
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Update color mutation
export const useUpdateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateColorPayload }) =>
      colorService.updateColor(id, data),
    onSuccess: (response, { id }) => {
      // Invalidate colors list
      queryClient.invalidateQueries({ queryKey: colorKeys.all });
      
      // Update specific color cache
      const updatedColor = response.data?.color;
      if (updatedColor) {
        queryClient.setQueryData(colorKeys.detail(id), updatedColor);
        
        // Update in list cache
        queryClient.setQueryData(colorKeys.lists(), (old: Color[] = []) =>
          old.map(color => color._id === id ? updatedColor : color)
        );
      }
      
      toast.success('Color updated successfully!');
      return updatedColor;
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Delete color mutation
export const useDeleteColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => colorService.deleteColor(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache immediately
      queryClient.setQueryData(colorKeys.lists(), (old: Color[] = []) =>
        old.filter(color => color._id !== deletedId)
      );
      
      // Remove specific color cache
      queryClient.removeQueries({ queryKey: colorKeys.detail(deletedId) });
      
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: colorKeys.all });
      
      toast.success('Color deleted successfully!');
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Bulk operations
export const useBulkDeleteColors = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      // Delete colors in parallel
      await Promise.all(ids.map(id => colorService.deleteColor(id)));
      return ids;
    },
    onSuccess: (deletedIds) => {
      // Remove from cache
      queryClient.setQueryData(colorKeys.lists(), (old: Color[] = []) =>
        old.filter(color => !deletedIds.includes(color._id))
      );
      
      // Remove specific color caches
      deletedIds.forEach(id => {
        queryClient.removeQueries({ queryKey: colorKeys.detail(id) });
      });
      
      queryClient.invalidateQueries({ queryKey: colorKeys.all });
      
      toast.success(`${deletedIds.length} colors deleted successfully!`);
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Bulk activate colors
export const useBulkActivateColors = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      // Activate colors in parallel
      const results = await Promise.all(
        ids.map(id => 
          colorService.updateColor(id, { isActive: true })
        )
      );
      return { ids, colors: results.map(r => r.data?.color).filter(Boolean) };
    },
    onSuccess: ({ ids, colors }) => {
      // Update cache optimistically
      queryClient.setQueryData(colorKeys.lists(), (old: Color[] = []) =>
        old.map(color => {
          if (ids.includes(color._id)) {
            return { ...color, isActive: true };
          }
          return color;
        })
      );
      
      // Update individual color caches
      colors.forEach(color => {
        if (color) {
          queryClient.setQueryData(colorKeys.detail(color._id), color);
        }
      });
      
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: colorKeys.all });
      
      toast.success(`${ids.length} colors activated successfully!`);
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Bulk deactivate colors
export const useBulkDeactivateColors = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      // Deactivate colors in parallel
      const results = await Promise.all(
        ids.map(id => 
          colorService.updateColor(id, { isActive: false })
        )
      );
      return { ids, colors: results.map(r => r.data?.color).filter(Boolean) };
    },
    onSuccess: ({ ids, colors }) => {
      // Update cache optimistically
      queryClient.setQueryData(colorKeys.lists(), (old: Color[] = []) =>
        old.map(color => {
          if (ids.includes(color._id)) {
            return { ...color, isActive: false };
          }
          return color;
        })
      );
      
      // Update individual color caches
      colors.forEach(color => {
        if (color) {
          queryClient.setQueryData(colorKeys.detail(color._id), color);
        }
      });
      
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: colorKeys.all });
      
      toast.success(`${ids.length} colors deactivated successfully!`);
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Smart bulk status update
export const useBulkUpdateColorStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      ids, 
      targetStatus 
    }: { 
      ids: string[]; 
      targetStatus: boolean; 
    }) => {
      // Update colors status in parallel
      const results = await Promise.all(
        ids.map(id => 
          colorService.updateColor(id, { isActive: targetStatus })
        )
      );
      return { 
        ids, 
        targetStatus,
        colors: results.map(r => r.data?.color).filter(Boolean) 
      };
    },
    onSuccess: ({ ids, targetStatus, colors }) => {
      // Update cache optimistically
      queryClient.setQueryData(colorKeys.lists(), (old: Color[] = []) =>
        old.map(color => {
          if (ids.includes(color._id)) {
            return { ...color, isActive: targetStatus };
          }
          return color;
        })
      );
      
      // Update individual color caches
      colors.forEach(color => {
        if (color) {
          queryClient.setQueryData(colorKeys.detail(color._id), color);
        }
      });
      
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: colorKeys.all });
      
      const action = targetStatus ? 'activated' : 'deactivated';
      toast.success(`${ids.length} colors ${action} successfully!`);
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Get active colors only (useful for selects)
export const useActiveColors = () => {
  return useQuery({
    queryKey: [...colorKeys.lists(), 'active'],
    queryFn: async () => {
      const response = await colorService.getColors();
      return (response.data || []).filter(color => color.isActive);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (active colors change less frequently)
  });
};