/**
 * Node modules
 */
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

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
import { GoogleIcon } from '@/components/icons/GoogleIcon';

/**
 * Hooks
 */
import { useAuth } from '@/hooks/useAuth';
import { LoaderCircleIcon } from 'lucide-react';

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty('Email is required')
    .email('Invalid email')
    .max(50, 'Maximum 50 characters'),
  password: z
    .string()
    .trim()
    .nonempty('Password is required')
    .min(1, 'Password is required'),
});

const LoginPage = () => {
  const { login } = useAuth();
  const [logoutReason, setLogoutReason] = useState('');

  useEffect(() => {
    const reason = localStorage.getItem('logoutReason');
    if (reason === 'session_expired') {
      setLogoutReason('Your session has expired or your password was changed. Please log in again.');
      localStorage.removeItem('logoutReason');
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await login.mutateAsync(values);
  };

  return (
    <div className="flex w-[400px] flex-col gap-6 rounded-lg bg-white p-5">
      {logoutReason && (
        <div className="flex items-center gap-3 mb-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 shadow-sm animate-fade-in">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <span className="text-yellow-800 font-medium">{logoutReason}</span>
        </div>
      )}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-primary text-2xl font-bold">
          Login to your account
        </h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="John@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <a
                    href=""
                    className="text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
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
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? (
              <LoaderCircleIcon className="size-5" />
            ) : (
              'Login'
            )}
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>
          <Button
            disabled={login.isPending}
            variant="outline"
            className="w-full"
            type="button"
          >
            <GoogleIcon />
            Login with Google
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
