export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    type: 'pet' | 'product';
    item: {
      _id: string;
      name: string;
      price: number;
      image?: string;
    };
    quantity: number;
    subtotal: number;
  }>;
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'pending_refund'
    | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  orderDate: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  refundInfo?: {
    reason: string;
    description?: string;
    bankName: string;
    accountNumber: string;
    amount: number;
    requestedAt: string;
  };
}
