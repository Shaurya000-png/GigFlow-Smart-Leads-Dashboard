import { ILead } from '../types';

export const generateLeadsCSV = (leads: any[]): string => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((lead) => [
    lead.name,
    lead.email,
    lead.status,
    lead.source,
    new Date(lead.createdAt).toISOString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
};
