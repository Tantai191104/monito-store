export interface CreateOrderPayload {
  items: Array<{
    type: 'pet' | 'product';
    itemId: string;
    quantity: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  notes?: string;
  paymentMethod?: string;
}

export interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
} 