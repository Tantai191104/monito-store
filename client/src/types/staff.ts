export interface Staff {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  permissions: string[];
  isActive: boolean;
  joinDate: string;
  lastLogin: string | null;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  department: string;
  position: string;
  permissions?: string[];
}

export interface UpdateStaffPayload {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  permissions?: string[];
  isActive?: boolean;
}

export interface StaffStats {
  total: number;
  active: number;
  inactive: number;
  departments: Array<{
    _id: string;
    total: number;
    active: number;
  }>;
}

export const DEPARTMENTS = [
  'Customer Service',
  'Product Management',
  'Operations',
  'Marketing',
] as const;

export const POSITIONS = [
  'Store Manager',
  'Assistant Manager',
  'Sales Associate',
  'Pet Care Specialist',
  'Professional Groomer',
  'Inventory Coordinator',
  'Customer Support Agent',
  'Marketing Specialist',
  'Content Creator',
];

export const PERMISSIONS = [
  'products',
  'pets',
  'orders',
  'customers',
  'categories',
  'breeds',
  'colors',
  'inventory',
  'shipping',
  'reports',
] as const;
