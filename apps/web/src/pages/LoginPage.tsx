import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { PasswordInput } from '../components/ui/password-input';
import { useAuth } from '../contexts/auth';
import { loginFormSchema, type LoginFormValues } from '../lib/validation/auth';

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    typeof location.state === 'object' &&
    location.state !== null &&
    'from' in location.state &&
    typeof (location.state as { from?: unknown }).from === 'string'
      ? (location.state as { from: string }).from
      : '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  // Use `from` (not hard-coded `/`) so a successful login that flips
  // `isAuthenticated` cannot race past navigate(from) back to Home.
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  async function onSubmit(values: LoginFormValues) {
    try {
      await login(values);
      toast.success('Signed in');
      void navigate(from, { replace: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast.error(message);
    }
  }

  return (
    <section className="mx-auto grid w-full max-w-3xl overflow-hidden rounded-[var(--cadence-radius)] border border-[var(--cadence-border)] bg-[var(--cadence-surface)] shadow-[var(--cadence-shadow-sm)] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="relative hidden flex-col justify-between overflow-hidden p-8 md:flex">
        <img
          src="/images/auth-bg-covers.jpg"
          alt=""
          className="absolute inset-0 size-full object-cover"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[var(--cadence-bg)]/55 dark:bg-[var(--cadence-bg)]/65" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(420px 260px at 30% 15%, color-mix(in srgb, var(--cadence-accent) 22%, transparent), transparent 65%)',
          }}
          aria-hidden
        />
        <div className="relative">
          <p className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
            Cadence
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--cadence-fg-muted)]">
            Your personal music catalog - rate songs, rank artists, keep covers.
          </p>
        </div>
        <p className="relative text-xs text-[var(--cadence-fg-muted)]">
          Quiet tools for serious listening.
        </p>
      </div>

      <div className="flex flex-col p-6 sm:p-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
          Log in
        </h1>
        <p className="mt-2 text-sm text-[var(--cadence-fg-muted)]">
          Welcome back to Cadence.
        </p>

        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={(event) => {
            void handleSubmit(onSubmit)(event);
          }}
          noValidate
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              {...register('email')}
            />
            {errors.email ? (
              <p className="text-sm text-[var(--cadence-destructive)]">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="login-password">Password</Label>
            <PasswordInput
              id="login-password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              {...register('password')}
            />
            {errors.password ? (
              <p className="text-sm text-[var(--cadence-destructive)]">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? 'Signing in…' : 'Log in'}
          </Button>
        </form>

        <p className="mt-6 text-sm text-[var(--cadence-fg-muted)]">
          No account?{' '}
          <Link
            to="/register"
            className="font-medium text-[var(--cadence-fg)] underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
