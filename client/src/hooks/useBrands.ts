import { useQuery } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';

export const useBrands = (params: URLSearchParams = new URLSearchParams()) => {
  return useQuery({
    queryKey: ['brands', params.toString()],
    queryFn: async () => {
      const response = await brandService.getBrands(params);
      return response.data?.brands || [];
    },
    staleTime: Infinity,
  });
};
