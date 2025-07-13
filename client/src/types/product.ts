import type { Category } from './category';

export interface Product {
  _id: string;
  name: string;
  category: Category;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  images: string[];
  specifications: {
    weight?: string;
    size?: string;
    material?: string;
    color?: string;
    ingredients?: string[];
  };
  stock: number;
  isInStock: boolean;
  tags: string[];
  gifts?: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  category: string; // ObjectId string
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  specifications: {
    weight?: string;
    size?: string;
    material?: string;
    color?: string;
    ingredients?: string[];
  };
  stock: number;
  tags?: string[];
  gifts?: string[];
  isActive?: boolean;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  search?: string; // ✅ Add search property
  includeInactiveCategories?: boolean; // ✅ Add includeInactiveCategories property
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
