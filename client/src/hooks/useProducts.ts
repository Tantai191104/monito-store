import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export const useProducts = (
  params: URLSearchParams = new URLSearchParams(),
) => {
  const queryKey = productKeys.list(params.toString());
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await productService.getProducts(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
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
