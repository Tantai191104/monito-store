export interface CreateStaffPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  department: string;
  position: string;
  permissions?: string[];
  avatarUrl?: string;
}

export type UpdateStaffPayload = Partial<CreateStaffPayload>;

export interface StaffFilters {
  department?: string;
  status?: 'active' | 'inactive';
  search?: string;
  page?: number;
  limit?: number;
}
