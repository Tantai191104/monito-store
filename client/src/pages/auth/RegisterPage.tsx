/**
 * Node modules
 */
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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

const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty('Name is required')
      .min(2, 'Minimum 2 characters')
      .max(50, 'Maximum 50 characters'),
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
      .min(8, 'Minimum 8 characters')
      .max(50, 'Maximum 50 characters'),
    confirmPassword: z
      .string()
      .trim()
      .nonempty('Confirm Password is required')
      .min(8, 'Minimum 8 characters')
      .max(50, 'Maximum 50 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password does not match',
    path: ['confirmPassword'],
  });

const RegisterPage = () => {
  const { register } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { confirmPassword, ...registerData } = values;
    await register.mutateAsync(registerData);
  };

  return (
    <div className="flex w-[400px] flex-col gap-4 rounded-lg bg-white p-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-[#003459] text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground text-sm text-pretty">
          Let's get started. Fill in the details below to create your account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                <FormLabel>Password</FormLabel>
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
            disabled={register.isPending}
          >
            {register.isPending ? (
              <LoaderCircleIcon className="size-5" />
            ) : (
              'Register'
            )}
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>
          <Button
            variant="outline"
            className="w-full bg-[#003459]"
            type="button"
            disabled={register.isPending}
          >
            <GoogleIcon />
            Login with Google
          </Button>
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterPage;
