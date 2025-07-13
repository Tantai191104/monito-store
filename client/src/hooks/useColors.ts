import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { colorService, type BulkDeleteResult } from '@/services/colorService';
import type {
  CreateColorPayload,
  UpdateColorPayload,
  Color,
} from '@/types/color';
import type { ApiError } from '@/types/api';
import { getErrorMessage } from '@/utils/errorHandler';

export const colorKeys = {
  all: ['colors'] as const,
  lists: () => [...colorKeys.all, 'list'] as const,
  list: (filters: string) => [...colorKeys.lists(), { filters }] as const,
  details: () => [...colorKeys.all, 'detail'] as const,
  detail: (id: string) => [...colorKeys.details(), id] as const,
  usageStats: (id: string) => [...colorKeys.all, 'usage-stats', id] as const,
};

// Get all colors
export const useColors = (params: URLSearchParams = new URLSearchParams()) => {
  return useQuery({
    queryKey: colorKeys.list(params.toString()),
    queryFn: async () => {
      const response = await colorService.getColors();
      const colors = response.data || [];

      // ✅ Ensure petCount is always a number
      return colors.map((color) => ({
        ...color,
        petCount: color.petCount || 0,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Get only active colors for pet forms
export const useActiveColors = () => {
  return useQuery({
    queryKey: [...colorKeys.lists(), 'active'],
    queryFn: async () => {
      const response = await colorService.getColors();
      const colors = response.data || [];
      return colors
        .filter((color) => color.isActive)
        .map((color) => ({
          ...color,
          petCount: color.petCount || 0,
        }));
    },
    staleTime: 5 * 60 * 1000,
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
      queryClient.invalidateQueries({ queryKey: colorKeys.all });
      const newColor = response.data?.color;
      if (newColor) {
        // ✅ Add to BEGINNING of list with petCount = 0
        queryClient.setQueryData(colorKeys.lists(), (old: Color[] = []) => [
          { ...newColor, petCount: 0 },
          ...old,
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
      queryClient.invalidateQueries({ queryKey: colorKeys.all });

      const updatedColor = response.data?.color;
      if (updatedColor) {
        // Update the color in all relevant queries
        queryClient.setQueryData(colorKeys.lists(), (old: Color[] = []) =>
          old.map((color) =>
            color._id === id
              ? { ...updatedColor, petCount: color.petCount }
              : color,
          ),
        );

        // Update individual color query
        queryClient.setQueryData(colorKeys.detail(id), updatedColor);
      }

      toast.success('Color updated successfully!');
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
        old.filter((color) => color._id !== deletedId),
      );

      // Remove specific color cache
      queryClient.removeQueries({ queryKey: colorKeys.detail(deletedId) });
      queryClient.removeQueries({
        queryKey: colorKeys.usageStats(deletedId),
      });
      queryClient.invalidateQueries({ queryKey: colorKeys.all });

      toast.success('Color deleted successfully!');
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;

      // ✅ Handle specific constraint violation error
      if (apiError?.errorCode === 'COLOR_IN_USE') {
        toast.error(apiError.message, {
          description:
            'Please reassign or delete pets using this color first.',
          duration: 6000,
        });
      } else {
        const message = getErrorMessage(apiError?.errorCode, apiError?.message);
        toast.error(message);
      }
    },
  });
};

// ✅ Enhanced bulk delete with constraint handling
export const useBulkDeleteColors = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => colorService.bulkDeleteColors(ids),
    onSuccess: (response) => {
      const result = response.data as BulkDeleteResult;

      // Remove successfully deleted colors from cache
      if (result.deleted.length > 0) {
        const deletedIds = result.deleted.map((color) => color._id);

        queryClient.setQueryData(colorKeys.lists(), (old: Color[] = []) =>
          old.filter((color) => !deletedIds.includes(color._id)),
        );

        deletedIds.forEach((id) => {
          queryClient.removeQueries({ queryKey: colorKeys.detail(id) });
          queryClient.removeQueries({ queryKey: colorKeys.usageStats(id) });
        });

        queryClient.invalidateQueries({ queryKey: colorKeys.all });
      }

      // Show detailed results
      if (result.failed.length === 0) {
        toast.success(
          `Successfully deleted ${result.deleted.length} colors!`,
        );
      } else if (result.deleted.length === 0) {
        toast.error('No colors could be deleted', {
          description: 'All selected colors are being used by pets.',
          duration: 6000,
        });
      } else {
        toast.warning(
          `Partial success: ${result.deleted.length} deleted, ${result.failed.length} failed`,
          {
            description: 'Some colors are being used by pets.',
            duration: 6000,
          },
        );
      }
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Bulk operations
export const useBulkActivateColors = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(
        ids.map((id) => colorService.updateColor(id, { isActive: true })),
      );
      return ids;
    },
    onSuccess: (activatedIds) => {
      queryClient.setQueryData(colorKeys.lists(), (old: Color[] = []) =>
        old.map((color) =>
          activatedIds.includes(color._id)
            ? { ...color, isActive: true }
            : color,
        ),
      );
      queryClient.invalidateQueries({ queryKey: colorKeys.all });
      toast.success(`${activatedIds.length} colors activated successfully!`);
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

export const useBulkDeactivateColors = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(
        ids.map((id) => colorService.updateColor(id, { isActive: false })),
      );
      return ids;
    },
    onSuccess: (deactivatedIds) => {
      queryClient.setQueryData(colorKeys.lists(), (old: Color[] = []) =>
        old.map((color) =>
          deactivatedIds.includes(color._id)
            ? { ...color, isActive: false }
            : color,
        ),
      );
      queryClient.invalidateQueries({ queryKey: colorKeys.all });
      toast.success(
        `${deactivatedIds.length} colors deactivated successfully!`,
      );
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
      targetStatus,
    }: {
      ids: string[];
      targetStatus: boolean;
    }) => {
      // Update colors status in parallel
      const results = await Promise.all(
        ids.map((id) =>
          colorService.updateColor(id, { isActive: targetStatus }),
        ),
      );
      return {
        ids,
        targetStatus,
        colors: results.map((r) => r.data?.color).filter(Boolean),
      };
    },
    onSuccess: ({ ids, targetStatus, colors }) => {
      // Update cache optimistically
      queryClient.setQueryData(colorKeys.lists(), (old: Color[] = []) =>
        old.map((color) => {
          if (ids.includes(color._id)) {
            return { ...color, isActive: targetStatus };
          }
          return color;
        }),
      );

      // Update individual color caches
      colors.forEach((color) => {
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

// Get color usage stats
export const useColorUsageStats = (id: string) => {
  return useQuery({
    queryKey: colorKeys.usageStats(id),
    queryFn: async () => {
      const response = await colorService.getColorUsageStats(id);
      return response.data;
    },
    enabled: !!id,
  });
};
