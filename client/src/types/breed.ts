export interface Breed {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  petCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBreedPayload {
  name: string;
  description?: string;
}

export interface UpdateBreedPayload {
  name?: string;
  description?: string;
  isActive?: boolean;
}
