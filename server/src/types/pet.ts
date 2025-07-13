import { Breed } from './breed';
import { Color } from './color';

export type Pet = {
  _id: string;
  name: string;
  breed: Breed | string;
  gender: 'Male' | 'Female';
  age: string;
  size: 'Small' | 'Medium' | 'Large';
  color: Color | string;
  price: number;
  images: string[];
  description?: string;
  isVaccinated: boolean;
  isDewormed: boolean;
  hasCert: boolean;
  hasMicrochip: boolean;
  location: string;
  publishedDate?: Date;
  additionalInfo?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePetPayload = {
  name: string;
  breed: string; // ObjectId string
  gender: 'Male' | 'Female';
  age: string;
  size: 'Small' | 'Medium' | 'Large';
  color: string; // ObjectId string
  price: number;
  images: string[];
  description?: string;
  isVaccinated?: boolean;
  isDewormed?: boolean;
  hasCert?: boolean;
  hasMicrochip?: boolean;
  location: string;
  publishedDate?: Date;
  additionalInfo?: string;
  isAvailable?: boolean;
};

export type UpdatePetPayload = Partial<CreatePetPayload>;

export type PetFilters = {
  breed?: string[];
  gender?: string[];
  size?: string[];
  color?: string[];
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'publishedDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
};
