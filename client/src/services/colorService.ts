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

// ✅ Add bulk delete result type
export interface BulkDeleteResult {
  deleted: Color[];
  failed: Array<{
    colorId: string;
    colorName: string;
    reason: string;
    petCount: number;
  }>;
}

// ✅ Add color usage stats type
export interface ColorUsageStats {
  color: Color;
  petCount: number;
  samplePets: Array<{ _id: string; name: string }>;
  canDelete: boolean;
}

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

  // ✅ New method for bulk delete
  async bulkDeleteColors(
    ids: string[],
  ): Promise<ApiResponse<BulkDeleteResult>> {
    const response = await API.post<ApiResponse<BulkDeleteResult>>(
      '/colors/bulk-delete',
      { ids },
    );
    return response.data;
  },

  // ✅ New method to get color usage stats
  async getColorUsageStats(
    id: string,
  ): Promise<ApiResponse<ColorUsageStats>> {
    const response = await API.get<ApiResponse<ColorUsageStats>>(
      `/colors/${id}/usage-stats`,
    );
    return response.data;
  },
};
