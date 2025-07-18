export interface Review {
  _id?: string;
  orderId: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt?: string;
} 