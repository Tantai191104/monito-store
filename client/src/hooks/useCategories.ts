import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Services
 */
import { categoryService } from '@/services/categoryService';

/**
 * Types
 */
import type {
  CreateCategoryPayload,
  UpdateCategoryPayload,
  Category,
} from '@/types/category';
import type { ApiError } from '@/types/api';

/**
 * Utils
 */
import { getErrorMessage } from '@/utils/errorHandler';

// Query keys for better cache management
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: string) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

// Get all categories
// export const useCategories = () => {
//   return useQuery({
//     queryKey: categoryKeys.lists(),
//     queryFn: async () => {
//       const response = await categoryService.getCategories();
//       return response.data || [];
//     },
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });
// };

export const useCategories = (
  params: URLSearchParams = new URLSearchParams(),
) => {
  return useQuery({
    queryKey: ['categories', params.toString()],
    queryFn: async () => {
      const response = await categoryService.getCategories(params);
      return response.data?.categories || [];
    },
    staleTime: Infinity,
  });
};

// Get single category by ID
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const response = await categoryService.getCategoryById(id);
      return response.data?.category;
    },
    enabled: !!id,
  });
};

// Create category mutation
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryPayload) =>
      categoryService.createCategory(data),
    onSuccess: (response) => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });

      // Optional: Update cache optimistically
      const newCategory = response.data?.category;
      if (newCategory) {
        queryClient.setQueryData(
          categoryKeys.lists(),
          (old: Category[] = []) => [newCategory, ...old],
        );
      }

      toast.success('Category created successfully!');
      return newCategory;
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Update category mutation
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryPayload }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (response, { id }) => {
      // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });

      // Update specific category cache
      const updatedCategory = response.data?.category;
      if (updatedCategory) {
        queryClient.setQueryData(categoryKeys.detail(id), updatedCategory);

        // Update in list cache
        queryClient.setQueryData(categoryKeys.lists(), (old: Category[] = []) =>
          old.map((cat) => (cat._id === id ? updatedCategory : cat)),
        );
      }

      toast.success('Category updated successfully!');
      return updatedCategory;
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Delete category mutation
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache immediately
      queryClient.setQueryData(categoryKeys.lists(), (old: Category[] = []) =>
        old.filter((cat) => cat._id !== deletedId),
      );

      // Remove specific category cache
      queryClient.removeQueries({ queryKey: categoryKeys.detail(deletedId) });

      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });

      toast.success('Category deleted successfully!');
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Bulk operations
export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      // Delete categories in parallel
      await Promise.all(ids.map((id) => categoryService.deleteCategory(id)));
      return ids;
    },
    onSuccess: (deletedIds) => {
      // Remove from cache
      queryClient.setQueryData(categoryKeys.lists(), (old: Category[] = []) =>
        old.filter((cat) => !deletedIds.includes(cat._id)),
      );

      // Remove specific category caches
      deletedIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });
      });

      queryClient.invalidateQueries({ queryKey: categoryKeys.all });

      toast.success(`${deletedIds.length} categories deleted successfully!`);
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// ✅ Bulk activate categories
export const useBulkActivateCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      // Activate categories in parallel
      const results = await Promise.all(
        ids.map((id) => categoryService.updateCategory(id, { isActive: true })),
      );
      return {
        ids,
        categories: results.map((r) => r.data?.category).filter(Boolean),
      };
    },
    onSuccess: ({ ids, categories }) => {
      // Update cache optimistically
      queryClient.setQueryData(categoryKeys.lists(), (old: Category[] = []) =>
        old.map((cat) => {
          if (ids.includes(cat._id)) {
            return { ...cat, isActive: true };
          }
          return cat;
        }),
      );

      // Update individual category caches
      categories.forEach((category) => {
        if (category) {
          queryClient.setQueryData(categoryKeys.detail(category._id), category);
        }
      });

      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });

      toast.success(`${ids.length} categories activated successfully!`);
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// ✅ Bulk deactivate categories
export const useBulkDeactivateCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      // Deactivate categories in parallel
      const results = await Promise.all(
        ids.map((id) =>
          categoryService.updateCategory(id, { isActive: false }),
        ),
      );
      return {
        ids,
        categories: results.map((r) => r.data?.category).filter(Boolean),
      };
    },
    onSuccess: ({ ids, categories }) => {
      // Update cache optimistically
      queryClient.setQueryData(categoryKeys.lists(), (old: Category[] = []) =>
        old.map((cat) => {
          if (ids.includes(cat._id)) {
            return { ...cat, isActive: false };
          }
          return cat;
        }),
      );

      // Update individual category caches
      categories.forEach((category) => {
        if (category) {
          queryClient.setQueryData(categoryKeys.detail(category._id), category);
        }
      });

      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });

      toast.success(`${ids.length} categories deactivated successfully!`);
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// ✅ Smart bulk status update (activate only inactive, deactivate only active)
export const useBulkUpdateCategoryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ids,
      targetStatus,
    }: {
      ids: string[];
      targetStatus: boolean;
    }) => {
      // Update categories status in parallel
      const results = await Promise.all(
        ids.map((id) =>
          categoryService.updateCategory(id, { isActive: targetStatus }),
        ),
      );
      return {
        ids,
        targetStatus,
        categories: results.map((r) => r.data?.category).filter(Boolean),
      };
    },
    onSuccess: ({ ids, targetStatus, categories }) => {
      // Update cache optimistically
      queryClient.setQueryData(categoryKeys.lists(), (old: Category[] = []) =>
        old.map((cat) => {
          if (ids.includes(cat._id)) {
            return { ...cat, isActive: targetStatus };
          }
          return cat;
        }),
      );

      // Update individual category caches
      categories.forEach((category) => {
        if (category) {
          queryClient.setQueryData(categoryKeys.detail(category._id), category);
        }
      });

      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });

      const action = targetStatus ? 'activated' : 'deactivated';
      toast.success(`${ids.length} categories ${action} successfully!`);
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Get active categories only (useful for selects)
export const useActiveCategories = () => {
  return useQuery({
    queryKey: [...categoryKeys.lists(), 'active'],
    queryFn: async () => {
      const response = await categoryService.getCategories();
      return (response.data || []).filter((cat) => cat.isActive);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (active categories change less frequently)
  });
};

