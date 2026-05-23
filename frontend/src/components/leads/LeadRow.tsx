import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Lead } from '../../types';
import { Badge } from '../ui/Badge';
import { useAuthStore } from '../../store/authStore';

interface LeadRowProps {
  lead: Lead;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  index?: number;
}

export const LeadRow: React.FC<LeadRowProps> = ({ lead, onView, onEdit, onDelete, index = 0 }) => {
  const user = useAuthStore((state) => state.user);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'New':
        return 'blue';
      case 'Contacted':
        return 'yellow';
      case 'Qualified':
        return 'green';
      case 'Lost':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <tr
      className="hover:bg-primary/[0.04] transition-colors duration-200 border-b border-border/30 animate-fade-in-up"
      style={{ animationDelay: `${220 + index * 35}ms` }}
    >
      <td className="px-4 py-3 whitespace-nowrap cursor-pointer" onClick={() => onView(lead)}>
        <div className="text-xs font-medium text-textMain tracking-tight">{lead.name}</div>
        <div className="text-2xs text-textMuted mt-0.5">{lead.email}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <Badge variant={getStatusVariant(lead.status)}>{lead.status}</Badge>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-2xs text-textMuted tracking-wide">{lead.source}</td>
      <td className="px-4 py-3 whitespace-nowrap text-2xs text-textMuted">
        {new Date(lead.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onView(lead)}
            className="text-textMuted hover:text-accent transition-colors duration-200"
            title="View Details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => onEdit(lead)}
            className="text-textMuted hover:text-primary transition-colors duration-200"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => onDelete(lead)}
              className="text-textMuted hover:text-red-400 transition-colors duration-200"
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
