/**
 * Payment Types
 */

export interface ZaloPayConfig {
  app_id: string;
  key1: string;
  key2: string;
  endpoint: string;
}

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

export interface ZaloPayCallbackData {
  app_trans_id: string;
  zp_trans_id: string;
  server_time: number;
  amount: number;
}

export interface PaymentTransaction {
  orderId: string;
  app_trans_id: string;
  zp_trans_token: string;
  amount: number;
  description: string;
  status?: 'pending' | 'success' | 'failed';
  zp_transaction_id?: string;
  payment_time?: Date;
}

export interface TTSPayload {
  amount: number;
}

export interface TTSResponse {
  audioContent: string;
  message: string;
} 