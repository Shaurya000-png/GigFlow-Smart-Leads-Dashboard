import React from 'react';
import { Lead } from '../../types';
import { Badge } from '../ui/Badge';
import { Mail, User, Clock } from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead | null;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead }) => {
  if (!lead) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
          {lead.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-white">{lead.name}</h2>
          <p className="text-textMuted flex items-center gap-2 mt-1">
            <Mail size={14} /> {lead.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
        <div>
          <p className="text-sm font-medium text-textMuted mb-1">Status</p>
          <Badge variant={
            lead.status === 'New' ? 'blue' : 
            lead.status === 'Contacted' ? 'yellow' : 
            lead.status === 'Qualified' ? 'green' : 'red'
          }>
            {lead.status}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm font-medium text-textMuted mb-1">Source</p>
          <p className="text-textMain font-medium">{lead.source}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-textMuted flex items-center gap-1.5 mb-1">
            <User size={14} /> Added By
          </p>
          <p className="text-textMain">{lead.createdBy?.name || 'Unknown'}</p>
          <p className="text-xs text-textMuted">{lead.createdBy?.email}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-textMuted flex items-center gap-1.5 mb-1">
            <Clock size={14} /> Added On
          </p>
          <p className="text-textMain">{new Date(lead.createdAt).toLocaleDateString()}</p>
          <p className="text-xs text-textMuted">
            {new Date(lead.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </p>
        </div>
      </div>
    </div>
  );
};
