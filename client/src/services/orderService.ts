import API from '@/lib/axios';
import type { ApiResponse, Pagination } from '@/types/api';
import type { Order } from '@/types/order';

export interface CreateOrderPayload {
  items: Array<{
    type: 'pet' | 'product';
    itemId: string;
    quantity: number;
  }>;
  shippingAddress: {
    street: string;
    province: string;
    district: string;
  };
  notes?: string;
}

export interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const orderService = {
  async createOrder(data: CreateOrderPayload): Promise<ApiResponse<{ order: Order }>> {
    const response = await API.post('/orders', data);
    return response.data;
  },

  async getOrders(params: URLSearchParams = new URLSearchParams()): Promise<ApiResponse<{ orders: Order[]; pagination: Pagination }>> {
    const response = await API.get(`/orders?${params.toString()}`);
    return response.data;
  },

  async getOrderById(id: string): Promise<ApiResponse<{ order: Order }>> {
    const response = await API.get(`/orders/${id}`);
    return response.data;
  },

  async cancelOrder(id: string): Promise<ApiResponse<{ order: Order }>> {
    const response = await API.patch(`/orders/${id}/cancel`);
    return response.data;
  },

  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<{ order: Order }>> {
    const response = await API.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
}; 