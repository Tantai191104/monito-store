/**
 * Lib
 */
import API from '@/lib/axios';

/**
 * Types
 */
import type { ApiResponse } from '@/types/api';
import type {
  Breed,
  CreateBreedPayload,
  UpdateBreedPayload,
} from '@/types/breed';

// ✅ Add bulk delete result type
export interface BulkDeleteResult {
  deleted: Breed[];
  failed: Array<{
    breedId: string;
    breedName: string;
    reason: string;
    petCount: number;
  }>;
}

export const breedService = {
  // Get all breeds
  async getBreeds(): Promise<ApiResponse<Breed[]>> {
    const response = await API.get<ApiResponse<Breed[]>>('/breeds');
    return response.data;
  },

  // Get breed by ID
  async getBreedById(id: string): Promise<ApiResponse<{ breed: Breed }>> {
    const response = await API.get<ApiResponse<{ breed: Breed }>>(
      `/breeds/${id}`,
    );
    return response.data;
  },

  // Create new breed
  async createBreed(
    data: CreateBreedPayload,
  ): Promise<ApiResponse<{ breed: Breed }>> {
    const response = await API.post<ApiResponse<{ breed: Breed }>>(
      '/breeds',
      data,
    );
    return response.data;
  },

  // Update breed
  async updateBreed(
    id: string,
    data: UpdateBreedPayload,
  ): Promise<ApiResponse<{ breed: Breed }>> {
    const response = await API.patch<ApiResponse<{ breed: Breed }>>(
      `/breeds/${id}`,
      data,
    );
    return response.data;
  },

  // Delete breed
  async deleteBreed(id: string): Promise<ApiResponse> {
    const response = await API.delete<ApiResponse>(`/breeds/${id}`);
    return response.data;
  },

  async bulkDeleteBreeds(
    ids: string[],
  ): Promise<ApiResponse<BulkDeleteResult>> {
    // ✅ Use POST instead of DELETE to send a request body
    const response = await API.post<ApiResponse<BulkDeleteResult>>(
      '/breeds/bulk-delete',
      { ids },
    );
    return response.data;
  },

  // Get breed usage statistics
  async getBreedUsageStats(id: string): Promise<
    ApiResponse<{
      breed: Breed;
      petCount: number;
      samplePets: Array<{ _id: string; name: string }>;
      canDelete: boolean;
    }>
  > {
    const response = await API.get<
      ApiResponse<{
        breed: Breed;
        petCount: number;
        samplePets: Array<{ _id: string; name: string }>;
        canDelete: boolean;
      }>
    >(`/breeds/${id}/usage-stats`);
    return response.data;
  },
};
