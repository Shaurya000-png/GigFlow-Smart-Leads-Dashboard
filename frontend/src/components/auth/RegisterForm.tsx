import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Input } from '../ui/Input';
import { PasswordInput } from '../ui/PasswordInput';
import { Button } from '../ui/Button';
import { AnimatedText } from '../ui/AnimatedText';
import { useRegister } from '../../hooks/useAuth';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(['admin', 'sales']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'sales',
    },
  });

  const registerMutation = useRegister();
  const navigate = useNavigate();

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      },
      {
        onSuccess: () => {
          navigate('/login');
        },
      }
    );
  };

  return (
    <div className="relative w-full glass-panel rounded-2xl p-7 shadow-2xl animate-fade-in-up" style={{ animationDelay: '150ms' }}>
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="absolute top-4 right-4 p-1.5 rounded-lg text-textMuted hover:text-textMain hover:bg-surfaceElevated border border-transparent hover:border-border transition-colors z-30"
        aria-label="Close and go back to sign in"
        title="Back to sign in"
      >
        <X size={18} strokeWidth={2} />
      </button>

      <div className="text-center mb-6 pr-6">
        <AnimatedText as="h2" delay={200} animation="text-reveal" className="text-base font-heading font-semibold text-premium">
          Join GigFlow
        </AnimatedText>
        <AnimatedText as="p" delay={280} className="text-premium-muted mt-1.5">
          Create an account to get started
        </AnimatedText>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <Input label="Full Name" placeholder="John Doe" {...register('name')} error={errors.name?.message} />

        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
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
              autoComplete="new-password"
              error={errors.password?.message}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <PasswordInput
              label="Confirm Password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          )}
        />

        <div className="w-full">
          <label className="block text-2xs font-medium text-textMuted uppercase tracking-label mb-1.5">Role</label>
          <select
            {...register('role')}
            className="filter-select w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          >
            <option value="sales">Sales Agent</option>
            <option value="admin">Administrator</option>
          </select>
          {errors.role && <p className="mt-1 text-2xs text-red-400">{errors.role.message}</p>}
        </div>

        <Button type="submit" className="w-full py-2 mt-2" isLoading={registerMutation.isPending}>
          Create Account
        </Button>
      </form>

      <div className="mt-5 text-center text-2xs text-textMuted">
        Already have an account?{' '}
        <Link to="/login" className="text-accent hover:text-primary transition-colors font-medium">
          Sign In
        </Link>
      </div>
    </div>
  );
};
