/**
 * Node modules
 */
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Services
 */
import { authService } from '@/services/authService';

/**
 * Types
 */
import type { ApiError } from '@/types/api';
import type { LoginPayload, RegisterPayload } from '@/types/user';

/**
 * Utils
 */
import { getErrorMessage } from '@/utils/errorHandler';
import type {
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from '@/types/user';

const IS_LOGIN = 'monito-store-isLogin';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const hasToken = localStorage.getItem(IS_LOGIN) !== null;

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      try {
        const user = await authService.getCurrentUser();
        return user ?? null; // Always return null if user is undefined
      } catch {
        return null; // Return null on error
      }
    },
    enabled: hasToken,
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
    onSuccess: (response) => {
      const user = response.data?.user;

      localStorage.setItem(IS_LOGIN, 'true');

      queryClient.setQueryData(['auth-user'], user);

      toast.success('Login successfully!');
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);

      toast.error(message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterPayload) => authService.register(data),
    onSuccess: () => {
      toast.success('Create new account successfully. Please login again!');
      navigate('/login');
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);

      toast.error(message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      localStorage.removeItem(IS_LOGIN);

      queryClient.setQueryData(['auth-user'], null);
      queryClient.clear();

      toast.success('Logout successfully!');
      navigate('/login');
    },
    onError: (error: any) => {
      localStorage.removeItem(IS_LOGIN);

      queryClient.setQueryData(['auth-user'], null);
      queryClient.clear();

      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);

      toast.error(message);
      navigate('/login');
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
  };
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => authService.updateProfile(data),
    onSuccess: (response) => {
      queryClient.setQueryData(['auth-user'], response.data);
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message || 'Failed to update profile.');
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordPayload) =>
      authService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message || 'Failed to change password.');
    },
  });
};
