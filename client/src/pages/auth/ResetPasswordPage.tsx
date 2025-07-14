/**
 * Node modules
 */
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';

/**
 * Components
 */
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderCircleIcon, CheckCircle } from 'lucide-react';

/**
 * Services
 */
import { authService } from '@/services/authService';

/**
 * Types
 */
import type { ResetPasswordPayload } from '@/types/user';

const formSchema = z
  .object({
    password: z
      .string()
      .trim()
      .nonempty('Password is required')
      .min(4, 'Password must be at least 4 characters'),
    confirmPassword: z
      .string()
      .trim()
      .nonempty('Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const resetPassword = useMutation({
    mutationFn: (data: ResetPasswordPayload) => authService.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successfully!');
      // Use replace to prevent going back to reset page
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to reset password'
      );
    },
  });

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset token');
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!token) return;
    
    await resetPassword.mutateAsync({
      token,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  if (!token) {
    return null;
  }

  if (resetPassword.isSuccess) {
    return (
      <div className="flex w-full flex-col gap-6 rounded-lg bg-white p-8 text-center shadow-lg border border-gray-200">
        <CheckCircle className="mx-auto size-16 text-green-600" />
        <div>
          <h1 className="text-primary text-2xl font-bold">
            Password Reset Successful!
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Your password has been successfully reset. Redirecting to login...
          </p>
        </div>
        <Link
          to="/login"
          className="text-primary hover:underline text-sm"
          replace
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 rounded-lg bg-white p-8 shadow-lg border border-gray-200">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-primary text-2xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your new password below
        </p>
      </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={resetPassword.isPending}
            >
              {resetPassword.isPending ? (
                <LoaderCircleIcon className="size-5 animate-spin" />
              ) : (
                'Reset Password'
              )}
            </Button>
              <Link to="/login" className="underline underline-offset-4">
                Back to Login
              </Link>
          </form>
        </Form>
    </div>
  );
};

export default ResetPasswordPage;
