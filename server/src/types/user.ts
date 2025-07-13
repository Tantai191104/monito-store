export type User = {
  _id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  isActive: boolean;
  role: string;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type RegisterPayload = Pick<User, 'name' | 'email'> & {
  password: string;
};

export type LoginPayload = Pick<User, 'email'> & {
  password: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
  confirmPassword: string;
};
