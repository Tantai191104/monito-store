import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Services
 */
import {
  categoryService,
  type BulkDeleteResult,
} from '@/services/categoryService';

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
  usageStats: (id: string) => [...categoryKeys.all, 'usage-stats', id] as const,
};

// Get all categories
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

// ✅ New hook for category usage stats
export const useCategoryUsageStats = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.usageStats(id),
    queryFn: async () => {
      const response = await categoryService.getCategoryUsageStats(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds - more frequent updates for usage stats
  });
};

// Create category mutation
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryPayload) =>
      categoryService.createCategory(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });

      const newCategory = response.data?.category;
      if (newCategory) {
        queryClient.setQueryData(
          categoryKeys.detail(newCategory._id),
          newCategory,
        );
      }

      toast.success('Category created successfully!');
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
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });

      const updatedCategory = response.data?.category;
      if (updatedCategory) {
        queryClient.setQueryData(categoryKeys.detail(id), updatedCategory);
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

// ✅ Enhanced delete category mutation with constraint handling
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(categoryKeys.lists(), (old: Category[] = []) =>
        old.filter((cat) => cat._id !== deletedId),
      );

      queryClient.removeQueries({ queryKey: categoryKeys.detail(deletedId) });
      queryClient.removeQueries({
        queryKey: categoryKeys.usageStats(deletedId),
      });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });

      toast.success('Category deleted successfully!');
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;

      // ✅ Handle specific constraint violation error
      if (apiError?.errorCode === 'CATEGORY_IN_USE') {
        toast.error(apiError.message, {
          description:
            'Please reassign or delete products using this category first.',
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
export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => categoryService.bulkDeleteCategories(ids),
    onSuccess: (response) => {
      const result = response.data as BulkDeleteResult;

      // Remove successfully deleted categories from cache
      if (result.deleted.length > 0) {
        const deletedIds = result.deleted.map((cat) => cat._id);

        queryClient.setQueryData(categoryKeys.lists(), (old: Category[] = []) =>
          old.filter((cat) => !deletedIds.includes(cat._id)),
        );

        deletedIds.forEach((id) => {
          queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });
          queryClient.removeQueries({ queryKey: categoryKeys.usageStats(id) });
        });

        queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      }

      // Show detailed results
      if (result.failed.length === 0) {
        toast.success(
          `Successfully deleted ${result.deleted.length} categories!`,
        );
      } else if (result.deleted.length === 0) {
        toast.error('No categories could be deleted', {
          description: 'All selected categories are being used by products.',
          duration: 6000,
        });
      } else {
        toast.warning(
          `Partial success: ${result.deleted.length} deleted, ${result.failed.length} failed`,
          {
            description: 'Some categories are being used by products.',
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

// Keep existing bulk activate/deactivate hooks unchanged...
export const useBulkActivateCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.all(
        ids.map((id) => categoryService.updateCategory(id, { isActive: true })),
      );
      return {
        ids,
        categories: results.map((r) => r.data?.category).filter(Boolean),
      };
    },
    onSuccess: ({ ids, categories }) => {
      queryClient.setQueryData(categoryKeys.lists(), (old: Category[] = []) =>
        old.map((cat) => {
          if (ids.includes(cat._id)) {
            return { ...cat, isActive: true };
          }
          return cat;
        }),
      );

      categories.forEach((category) => {
        if (category) {
          queryClient.setQueryData(categoryKeys.detail(category._id), category);
        }
      });

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

export const useBulkDeactivateCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
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
      queryClient.setQueryData(categoryKeys.lists(), (old: Category[] = []) =>
        old.map((cat) => {
          if (ids.includes(cat._id)) {
            return { ...cat, isActive: false };
          }
          return cat;
        }),
      );

      categories.forEach((category) => {
        if (category) {
          queryClient.setQueryData(categoryKeys.detail(category._id), category);
        }
      });

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
      queryClient.setQueryData(categoryKeys.lists(), (old: Category[] = []) =>
        old.map((cat) => {
          if (ids.includes(cat._id)) {
            return { ...cat, isActive: targetStatus };
          }
          return cat;
        }),
      );

      categories.forEach((category) => {
        if (category) {
          queryClient.setQueryData(categoryKeys.detail(category._id), category);
        }
      });

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

      const allCategories = response.data?.categories || [];
      const activeCategories = allCategories.filter((cat: any) => cat.isActive);

      return activeCategories;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: true,
  });
};
