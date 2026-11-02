import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { PasswordInput } from '../components/ui/password-input';
import { useAuth } from '../contexts/auth';
import {
  registerFormSchema,
  type RegisterFormValues,
} from '../lib/validation/auth';

export function RegisterPage() {
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(values: RegisterFormValues) {
    try {
      await registerUser(values);
      toast.success('Account created');
      void navigate('/', { replace: true });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Registration failed';
      toast.error(message);
    }
  }

  return (
    <section className="mx-auto w-full max-w-md">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
        Sign up
      </h1>
      <p className="mt-2 text-sm text-[var(--cadence-fg-muted)]">
        Create your Cadence catalog account.
      </p>

      <form
        className="mt-8 flex flex-col gap-4"
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event);
        }}
        noValidate
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="register-name">Name</Label>
          <Input
            id="register-name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            {...register('name')}
          />
          {errors.name ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
          {errors.email ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="register-password">Password</Label>
          <PasswordInput
            id="register-password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          {errors.password ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          ) : (
            <p className="text-xs text-[var(--cadence-fg-muted)]">
              8-24 chars with upper, lower, number, and symbol.
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? 'Creating…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-[var(--cadence-fg-muted)]">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-[var(--cadence-fg)] underline underline-offset-4"
        >
          Log in
        </Link>
      </p>
    </section>
  );
}
