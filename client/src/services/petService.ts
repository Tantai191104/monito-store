/**
 * Lib
 */
import API from '@/lib/axios';

/**
 * Types
 */
import type { ApiResponse } from '@/types/api';
import type { CreatePetPayload, Pet, UpdatePetPayload } from '@/types/pet';
import type { Pagination } from '@/types/api';

export const petService = {
  // Get all pets
  async getPets(
    params: URLSearchParams = new URLSearchParams(),
  ): Promise<ApiResponse<{ pets: Pet[]; pagination: Pagination }>> {
    const response = await API.get(`/pets?${params.toString()}`);
    return response.data;
  },

  // Get pet by ID
  async getPetById(id: string): Promise<ApiResponse<{ pet: Pet }>> {
    const response = await API.get<ApiResponse<{ pet: Pet }>>(`/pets/${id}`);
    return response.data;
  },

  // Create new pet
  async createPet(data: CreatePetPayload): Promise<ApiResponse<{ pet: Pet }>> {
    const response = await API.post<ApiResponse<{ pet: Pet }>>('/pets', data);
    return response.data;
  },

  // Update pet
  async updatePet(
    id: string,
    data: UpdatePetPayload,
  ): Promise<ApiResponse<{ pet: Pet }>> {
    const response = await API.patch<ApiResponse<{ pet: Pet }>>(
      `/pets/${id}`,
      data,
    );
    return response.data;
  },

  // Update pet availability
  async updateAvailability(
    id: string,
    isAvailable: boolean,
  ): Promise<ApiResponse<{ pet: Pet }>> {
    const response = await API.patch<ApiResponse<{ pet: Pet }>>(
      `/pets/${id}/availability`,
      { isAvailable },
    );
    return response.data;
  },

  // Delete pet
  async deletePet(id: string): Promise<ApiResponse> {
    const response = await API.delete<ApiResponse>(`/pets/${id}`);
    return response.data;
  },
};
