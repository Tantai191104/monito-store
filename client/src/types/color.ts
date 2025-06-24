export interface Color {
  _id: string;
  name: string;
  hexCode: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateColorPayload {
  name: string;
  hexCode: string;
  description?: string;
}

export interface UpdateColorPayload {
  name?: string;
  hexCode?: string;
  description?: string;
  isActive?: boolean;
}
