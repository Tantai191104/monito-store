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

const IS_LOGIN = 'monito-store-isLogin';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const hasToken = localStorage.getItem(IS_LOGIN) !== null;

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const response = await authService.getCurrentUser();
      return response.data?.user;
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
