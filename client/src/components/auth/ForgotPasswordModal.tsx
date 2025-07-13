/**
 * Node modules
 */
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';

/**
 * Components
 */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

interface ForgotPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ForgotPasswordModal = ({ open, onOpenChange }: ForgotPasswordModalProps) => {
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

  const handleClose = () => {
    setIsEmailSent(false);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isEmailSent ? 'Check Your Email' : 'Forgot Password'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isEmailSent
              ? 'We\'ve sent a password reset link to your email address.'
              : 'Enter your email address and we\'ll send you a link to reset your password.'}
          </DialogDescription>
        </DialogHeader>

        {isEmailSent ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <CheckCircle className="size-12 text-green-600" />
            <p className="text-sm text-center text-muted-foreground">
              If an account with that email exists, you'll receive a password reset link shortly.
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        ) : (
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
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                  disabled={forgotPassword.isPending}
                >
                  Cancel
                </Button>
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
