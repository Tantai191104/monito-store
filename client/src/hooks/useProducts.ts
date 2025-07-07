import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';

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
