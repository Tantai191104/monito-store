export interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {
  isActive?: boolean;
}

export interface CategoriesResponse {
  categories: Category[];
  total: number;
}
