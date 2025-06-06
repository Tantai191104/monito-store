/**
 * Lib
 */
import API from '@/lib/axios';

/**
 * Types
 */
import type { ApiResponse } from '@/types/api';
import type { LoginPayload, RegisterPayload, User } from '@/types/user';

export const authService = {
  async register(data: RegisterPayload) {
    const response = await API.post('/auth/register', data);
    return response.data;
  },

  async login(data: LoginPayload) {
    const response = await API.post<ApiResponse<User>>('/auth/login', data);
    return response.data;
  },

  async logout() {
    const response = await API.post('/auth/logout');
    return response.data;
  },

  async refreshToken() {
    const response = await API.post('/auth/refresh-token');
    return response.data;
  },

  async getCurrentUser() {
    const response = await API.get<ApiResponse<User>>('/user/current-user');
    return response.data;
  },
};
