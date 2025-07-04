import { useQuery } from '@tanstack/react-query';
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
      return response.data?.products || [];
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
