export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  phone?: string;
  isActive: boolean;
  lastLogin: Date | null;
  joinDate: Date;
  
  // Staff-specific fields
  department?: string;
  position?: string;
  permissions?: string[];
  
  // Customer-specific fields
  orders?: number;
  totalSpent?: number;
};

export type RegisterPayload = Pick<User, 'name' | 'email'> & {
  password: string;
};

export type LoginPayload = Pick<User, 'email'> & {
  password: string;
};
