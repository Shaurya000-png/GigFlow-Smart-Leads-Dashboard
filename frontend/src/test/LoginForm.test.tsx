import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginForm } from '../components/auth/LoginForm';

vi.mock('../hooks/useAuth', () => ({
  useLogin: () => ({ mutate: vi.fn(), isPending: false }),
}));

const renderLogin = () => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('requires password with minimum length', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByPlaceholderText('you@example.com'), 'valid@email.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'abc');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/at least 6 characters/i)).toBeInTheDocument();
  });

  it('lists demo account shortcuts', () => {
    renderLogin();
    expect(screen.getByText(/demo accounts/i)).toBeInTheDocument();
    expect(screen.getByText('demo.admin@gigflow.com')).toBeInTheDocument();
  });
});
