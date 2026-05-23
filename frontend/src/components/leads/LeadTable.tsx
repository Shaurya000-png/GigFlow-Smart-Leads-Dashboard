import React from 'react';
import { Lead } from '../../types';
import { LeadRow } from './LeadRow';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onAddLead: () => void;
}

const thClass =
  'px-4 py-3 text-left text-2xs font-medium text-textMuted uppercase tracking-label';

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onAddLead,
}) => {
  if (isLoading) {
    return (
      <div className="w-full surface-card overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-border">
            <thead className="bg-surfaceElevated/40">
              <tr>
                <th className={thClass}>Lead Info</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Source</th>
                <th className={thClass}>Created</th>
                <th className="px-4 py-3 relative"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Skeleton className="h-8 w-40" />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Skeleton className="h-5 w-16 rounded-md" />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Skeleton className="h-6 w-16 ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="w-full surface-card animate-fade-in">
        <EmptyState
          title="No leads found"
          description="Try adjusting your filters or add a new lead."
          showCTA
          onCTA={onAddLead}
          ctaLabel="Add Lead"
        />
      </div>
    );
  }

  return (
    <div className="w-full surface-card overflow-hidden animate-fade-in-up" style={{ animationDelay: '180ms' }}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-border">
          <thead className="bg-surfaceElevated/50">
            <tr>
              <th className={thClass}>Lead Info</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Source</th>
              <th className={thClass}>Created</th>
              <th className={`${thClass} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {leads.map((lead, i) => (
              <LeadRow
                key={lead._id}
                lead={lead}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                index={i}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
