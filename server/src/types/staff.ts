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

export interface UpdateStaffPayload {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  permissions?: string[];
  isActive?: boolean;
  avatarUrl?: string;
}

export interface StaffFilters {
  department?: string;
  status?: 'active' | 'inactive';
  search?: string;
  page?: number;
  limit?: number;
}
