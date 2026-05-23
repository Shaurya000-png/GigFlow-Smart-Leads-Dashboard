import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../ui/Input';
import { PasswordInput } from '../ui/PasswordInput';
import { Button } from '../ui/Button';
import { AnimatedText } from '../ui/AnimatedText';
import { useLogin } from '../../hooks/useAuth';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'demo.admin@gigflow.com', password: 'Demo123!' },
  { role: 'Sales', email: 'demo.sales@gigflow.com', password: 'Demo123!' },
] as const;

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();
  const navigate = useNavigate();

  const fillDemo = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
  };

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate('/dashboard');
      },
    });
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-7 shadow-2xl animate-fade-in-up" style={{ animationDelay: '150ms' }}>
      <div className="text-center mb-6">
        <AnimatedText as="h2" delay={200} animation="text-reveal" className="text-base font-heading font-semibold text-premium">
          Welcome back
        </AnimatedText>
        <AnimatedText as="p" delay={280} className="text-premium-muted mt-1.5">
          Sign in to manage your leads
        </AnimatedText>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordInput
              label="Password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          )}
        />

        <Button type="submit" className="w-full py-2 mt-2" isLoading={loginMutation.isPending}>
          Sign In
        </Button>
      </form>

      <div className="mt-5 p-3.5 rounded-xl bg-surfaceElevated/50 border border-border">
        <p className="text-2xs font-medium text-textMuted uppercase tracking-label mb-2.5">Demo accounts</p>
        <div className="space-y-1.5">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.role}
              type="button"
              onClick={() => fillDemo(account.email, account.password)}
              className="w-full text-left px-3 py-2 rounded-lg border border-border/80 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group"
            >
              <span className="text-2xs font-semibold text-accent tracking-wide">{account.role}</span>
              <span className="block text-xs text-textMain group-hover:text-accent truncate mt-0.5">
                {account.email}
              </span>
              <span className="block text-2xs text-textMuted mt-0.5">Password: {account.password}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 text-center text-2xs text-textMuted">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-accent hover:text-primary transition-colors font-medium">
          Create one
        </Link>
      </div>
    </div>
  );
};
