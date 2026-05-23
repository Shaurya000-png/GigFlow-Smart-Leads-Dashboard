import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeadFilters } from '../components/leads/LeadFilters';

vi.mock('../store/authStore', () => ({
  useAuthStore: (selector: (s: { user: { role: string } }) => unknown) =>
    selector({ user: { role: 'admin' } }),
}));

vi.mock('../utils/exportCSV', () => ({
  exportCSV: vi.fn(),
}));

describe('LeadFilters', () => {
  it('renders filter controls and add lead button', () => {
    const setFilters = vi.fn();
    render(
      <LeadFilters
        filters={{ status: 'All', source: 'All', search: '', sort: 'latest', page: 1, limit: 10 }}
        setFilters={setFilters}
        onAddLead={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText(/search leads/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add lead/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
  });

  it('updates search filter on input', async () => {
    const user = userEvent.setup();
    const setFilters = vi.fn();

    render(
      <LeadFilters
        filters={{ status: 'All', source: 'All', search: '', sort: 'latest', page: 1, limit: 10 }}
        setFilters={setFilters}
        onAddLead={vi.fn()}
      />
    );

    await user.type(screen.getByPlaceholderText(/search leads/i), 'rahul');

    expect(setFilters).toHaveBeenCalled();
  });
});
