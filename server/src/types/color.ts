export type Color = {
  _id: string;
  name: string;
  hexCode: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateColorPayload = {
  name: string;
  hexCode: string;
  description?: string;
};

export type UpdateColorPayload = Partial<CreateColorPayload> & {
  isActive?: boolean;
};
