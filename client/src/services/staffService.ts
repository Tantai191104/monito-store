import API from '@/lib/axios';
import type {
  Staff,
  CreateStaffPayload,
  UpdateStaffPayload,
  StaffStats,
} from '@/types/staff';
import type { ApiResponse } from '@/types/api';

export const staffService = {
  // Get all staff
  async getStaff(params?: {
    department?: string;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<Staff[]>> {
    const searchParams = new URLSearchParams();
    if (params?.department)
      searchParams.append('department', params.department);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);

    const response = await API.get<ApiResponse<Staff[]>>(
      `/staff?${searchParams.toString()}`,
    );
    return response.data;
  },

  // Get staff by ID
  async getStaffById(id: string): Promise<ApiResponse<{ staff: Staff }>> {
    const response = await API.get<ApiResponse<{ staff: Staff }>>(
      `/staff/${id}`,
    );
    return response.data;
  },

  // Create new staff
  async createStaff(
    data: CreateStaffPayload,
  ): Promise<ApiResponse<{ staff: Staff }>> {
    const response = await API.post<ApiResponse<{ staff: Staff }>>(
      '/staff',
      data,
    );
    return response.data;
  },

  // Update staff
  async updateStaff(
    id: string,
    data: UpdateStaffPayload,
  ): Promise<ApiResponse<{ staff: Staff }>> {
    const response = await API.patch<ApiResponse<{ staff: Staff }>>(
      `/staff/${id}`,
      data,
    );
    return response.data;
  },

  // Delete staff
  async deleteStaff(id: string): Promise<ApiResponse> {
    const response = await API.delete<ApiResponse>(`/staff/${id}`);
    return response.data;
  },

  // Update permissions
  async updatePermissions(
    id: string,
    permissions: string[],
  ): Promise<ApiResponse<{ staff: Staff }>> {
    const response = await API.patch<ApiResponse<{ staff: Staff }>>(
      `/staff/${id}/permissions`,
      { permissions },
    );
    return response.data;
  },

  // Get staff statistics
  async getStaffStats(): Promise<ApiResponse<StaffStats>> {
    const response = await API.get<ApiResponse<StaffStats>>('/staff/stats');
    return response.data;
  },
};
