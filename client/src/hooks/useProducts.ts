import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { getErrorMessage } from '@/utils/errorHandler';
import type { ApiError } from '@/types/api';
import type { Product } from '@/types/product';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Hook to invalidate product queries
export const useInvalidateProductQueries = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: productKeys.all });
    queryClient.removeQueries({ queryKey: productKeys.lists() });
  };
};

export const useProducts = (
  params: URLSearchParams = new URLSearchParams(),
) => {
  // Always add isActive=true unless already set
  const paramsWithActive = new URLSearchParams(params.toString());
  if (!paramsWithActive.has('isActive')) {
    paramsWithActive.set('isActive', 'true');
  }
  const hasFilters = paramsWithActive.toString().length > 0;
  const queryKey = hasFilters
    ? productKeys.list(paramsWithActive.toString())
    : productKeys.list('all');

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await productService.getProducts(paramsWithActive);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useProduct = (id: string) => {
  const queryKey = productKeys.detail(id);
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await productService.getProductById(id);
      return response.data?.product;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await productService.deleteProduct(productId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (error: any) => {
      console.error('Delete product error:', error);
      throw error;
    },
  });
};

export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await productService.updateProduct(id, { isActive });
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      console.error('Toggle product status error:', error);
      throw error;
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await productService.updateProduct(id, data);
      return response;
    },
    onSuccess: (data, variables) => {
      // 💡 FIX: Use the `data` parameter, which is the response from the mutation function.
      const updatedProduct = data.data.product;

      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.all });

      // Update cache for product detail to provide an instant UI update
      queryClient.setQueryData(
        productKeys.detail(variables.id),
        updatedProduct,
      );
    },
    onError: (error: any) => {
      console.error('❌ Update product error:', error);
      throw error;
    },
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProductData: any) => {
      const response = await productService.createProduct(newProductData);
      return response.data.product;
    },
    onSuccess: () => {
      // ✅ Vô hiệu hóa các query liên quan đến danh sách sản phẩm
      // Điều này sẽ buộc React Query phải fetch lại dữ liệu mới
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (error: any) => {
      // Xử lý lỗi tập trung tại đây
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message || 'Failed to add product.');
      // Ném lỗi ra ngoài để component có thể xử lý nếu cần
      throw error;
    },
  });
};

// ✅ Bulk operations
export const useBulkDeleteProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => productService.deleteProduct(id)));
      return ids;
    },
    onSuccess: (deletedIds) => {
      queryClient.setQueryData(
        productKeys.lists(),
        (oldData: { products: Product[] } | undefined) => {
          if (!oldData) return { products: [] };
          return {
            ...oldData,
            products: oldData.products.filter(
              (p) => !deletedIds.includes(p._id),
            ),
          };
        },
      );
      deletedIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success(`${deletedIds.length} products deleted successfully!`);
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

export const useBulkUpdateProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ids,
      isActive,
    }: {
      ids: string[];
      isActive: boolean;
    }) => {
      const results = await Promise.all(
        ids.map((id) => productService.updateProduct(id, { isActive })),
      );
      return {
        updatedProducts: results.map((r) => r.data.product),
        isActive,
      };
    },
    onSuccess: ({ updatedProducts, isActive }) => {
      const updatedIds = updatedProducts.map((p) => p._id);
      queryClient.setQueryData(
        productKeys.lists(),
        (oldData: { products: Product[] } | undefined) => {
          if (!oldData) return { products: [] };
          return {
            ...oldData,
            products: oldData.products.map((p) =>
              updatedIds.includes(p._id) ? { ...p, isActive } : p,
            ),
          };
        },
      );
      updatedProducts.forEach((product) => {
        queryClient.setQueryData(productKeys.detail(product._id), product);
      });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success(
        `${updatedIds.length} products ${
          isActive ? 'activated' : 'deactivated'
        } successfully!`,
      );
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};
