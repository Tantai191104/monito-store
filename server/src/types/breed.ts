export type Breed = {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateBreedPayload = {
  name: string;
  description?: string;
};

export type UpdateBreedPayload = Partial<CreateBreedPayload> & {
  isActive?: boolean;
};
