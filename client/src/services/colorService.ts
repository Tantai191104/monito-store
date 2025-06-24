/**
 * Lib
 */
import API from '@/lib/axios';

/**
 * Types
 */
import type { ApiResponse } from '@/types/api';
import type {
  Color,
  CreateColorPayload,
  UpdateColorPayload,
} from '@/types/color';

export const colorService = {
  // Get all colors
  async getColors(): Promise<ApiResponse<Color[]>> {
    const response = await API.get<ApiResponse<Color[]>>('/colors');
    return response.data;
  },

  // Get color by ID
  async getColorById(id: string): Promise<ApiResponse<{ color: Color }>> {
    const response = await API.get<ApiResponse<{ color: Color }>>(
      `/colors/${id}`,
    );
    return response.data;
  },

  // Create new color
  async createColor(
    data: CreateColorPayload,
  ): Promise<ApiResponse<{ color: Color }>> {
    const response = await API.post<ApiResponse<{ color: Color }>>(
      '/colors',
      data,
    );
    return response.data;
  },

  // Update color
  async updateColor(
    id: string,
    data: UpdateColorPayload,
  ): Promise<ApiResponse<{ color: Color }>> {
    const response = await API.patch<ApiResponse<{ color: Color }>>(
      `/colors/${id}`,
      data,
    );
    return response.data;
  },

  // Delete color
  async deleteColor(id: string): Promise<ApiResponse> {
    const response = await API.delete<ApiResponse>(`/colors/${id}`);
    return response.data;
  },
};
