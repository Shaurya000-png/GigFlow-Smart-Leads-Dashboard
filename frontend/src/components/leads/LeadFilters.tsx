import React, { useState } from 'react';
import { Search, Download, Plus } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { LeadFilters as ILeadFilters } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { exportCSV } from '../../utils/exportCSV';

interface LeadFiltersProps {
  filters: ILeadFilters;
  setFilters: React.Dispatch<React.SetStateAction<ILeadFilters>>;
  onAddLead: () => void;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({ filters, setFilters, onAddLead }) => {
  const [searchValue, setSearchValue] = useState(filters.search);
  const user = useAuthStore(state => state.user);
  const [isExporting, setIsExporting] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportCSV(filters);
    } finally {
      setIsExporting(false);
    }
  };

  const selectClass =
    'filter-select h-9 px-3 text-xs border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200 w-full sm:w-auto';

  return (
    <div className="flex flex-col md:flex-row gap-3 justify-between items-center surface-card p-3.5 mb-5 animate-fade-in-up" style={{ animationDelay: '120ms' }}>
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={15} className="text-textMuted" />
          </div>
          <Input 
            type="text"
            placeholder="Search leads..."
            className="form-field pl-9 h-9 text-xs"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
        
        <select className={selectClass} value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </select>

        <select className={selectClass} value={filters.source}
          onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value, page: 1 }))}
        >
          <option value="All">All Sources</option>
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </select>

        <select className={selectClass} value={filters.sort}
          onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value as any, page: 1 }))}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
        {user?.role === 'admin' && (
          <Button variant="secondary" onClick={handleExport} isLoading={isExporting} className="w-full sm:w-auto">
            <Download size={14} className="mr-1.5" /> Export
          </Button>
        )}
        <Button onClick={onAddLead} className="w-full sm:w-auto whitespace-nowrap">
          <Plus size={14} className="mr-1.5" /> Add Lead
        </Button>
      </div>
    </div>
  );
};
