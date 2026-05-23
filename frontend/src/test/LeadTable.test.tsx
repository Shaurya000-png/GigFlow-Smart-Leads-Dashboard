import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LeadTable } from '../components/leads/LeadTable';

const sampleLeads = [
  {
    _id: '1',
    name: 'Rahul Sharma',
    email: 'rahul@test.com',
    status: 'New' as const,
    source: 'Website' as const,
    createdBy: { name: 'Admin', email: 'admin@test.com' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

describe('LeadTable', () => {
  it('renders lead rows', () => {
    render(
      <LeadTable
        leads={sampleLeads}
        isLoading={false}
        onView={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onAddLead={vi.fn()}
      />
    );

    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    expect(screen.getByText('rahul@test.com')).toBeInTheDocument();
  });

  it('shows empty state when no leads', () => {
    render(
      <LeadTable
        leads={[]}
        isLoading={false}
        onView={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onAddLead={vi.fn()}
      />
    );

    expect(screen.getByText(/no leads found/i)).toBeInTheDocument();
  });
});
