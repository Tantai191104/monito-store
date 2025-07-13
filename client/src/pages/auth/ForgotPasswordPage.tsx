/**
 * Node modules
 */
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';
import { Link } from 'react-router-dom';

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
import type { ForgotPasswordPayload } from '@/types/user';

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty('Email is required')
    .email('Invalid email')
    .max(50, 'Maximum 50 characters'),
});

const ForgotPasswordPage = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const forgotPassword = useMutation({
    mutationFn: (data: ForgotPasswordPayload) => authService.forgotPassword(data),
    onSuccess: () => {
      setIsEmailSent(true);
      toast.success('Password reset email sent successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to send reset email');
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await forgotPassword.mutateAsync(values);
  };

  if (isEmailSent) {
    return (
      <div className="flex w-full flex-col gap-6 rounded-lg bg-white p-8 text-center shadow-lg border border-gray-200">
        <CheckCircle className="mx-auto size-16 text-green-600" />
        <div>
          <h1 className="text-primary text-2xl font-bold">
            Check Your Email
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            We've sent a password reset link to your email address.
          </p>
          <p className="text-muted-foreground text-xs mt-4">
            If an account with that email exists, you'll receive a password reset link shortly.
          </p>
        </div>
        <Link
          to="/login"
          className="text-primary hover:underline text-sm"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 rounded-lg bg-white p-8 shadow-lg border border-gray-200">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-primary text-2xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email address"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3">
            <Link
              to="/login"
              className="flex-1"
            >
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={forgotPassword.isPending}
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="flex-1"
              disabled={forgotPassword.isPending}
            >
              {forgotPassword.isPending ? (
                <LoaderCircleIcon className="size-4 animate-spin" />
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordPage;
