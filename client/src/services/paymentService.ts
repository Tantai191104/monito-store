import API from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

export interface CreateZaloPayOrderPayload {
  orderId: string;
  amount: number;
  description: string;
}

export interface ZaloPayOrderResponse {
  order_url: string;
  app_trans_id: string;
  zp_trans_token: string;
}

export const paymentService = {
  async createZaloPayOrder(data: CreateZaloPayOrderPayload): Promise<ApiResponse<ZaloPayOrderResponse>> {
    const response = await API.post<ApiResponse<ZaloPayOrderResponse>>('/payment/zalopay/create-order', data);
    return response.data;
  },

  async checkPaymentStatus(orderId: string): Promise<ApiResponse<{ order: any }>> {
    const response = await API.get<ApiResponse<{ order: any }>>(`/orders/${orderId}`);
    return response.data;
  },
}; 