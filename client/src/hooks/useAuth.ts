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
import type { LoginPayload, RegisterPayload } from '@/types/user';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const hasToken = localStorage.getItem('monito-store-isLogin') !== null;

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const response = await authService.getCurrentUser();
      return response.data;
    },
    enabled: hasToken,
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
    onSuccess: (response) => {
      const user = response.data!;

      localStorage.setItem('monito-store-isLogin', 'true');

      queryClient.setQueryData(['auth-user'], user);

      toast.success('Login successfully!');
    },
    onError: (error: any) => {
      toast.error('Something went wrong!');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterPayload) => authService.register(data),
    onSuccess: () => {
      toast.success('Create new account successfully!');
      navigate('/sign-in');
    },
    onError: (error: any) => {
      toast.error('Something went wrong!');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      localStorage.removeItem('monito-store-isLogin');

      queryClient.setQueryData(['auth-user'], null);

      toast.success('Logout successfully!');
      navigate('/sign-in');
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
