import API from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { Brand } from '@/types/brand';

export const brandService = {
  async getBrands(
    params: URLSearchParams = new URLSearchParams(),
  ): Promise<ApiResponse<{ brands: Brand[] }>> {
    const response = await API.get(`/brands?${params.toString()}`);
    return response.data;
  },
};
