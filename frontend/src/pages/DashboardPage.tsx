import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { AnimatedText } from '../components/ui/AnimatedText';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadForm } from '../components/leads/LeadForm';
import { LeadDetailModal } from '../components/leads/LeadDetailModal';
import { Pagination } from '../components/leads/Pagination';
import { Modal } from '../components/ui/Modal';
import { useLeads, useDeleteLead } from '../hooks/useLeads';
import { LeadFilters as ILeadFilters, Lead } from '../types';
import { useDebounce } from '../hooks/useDebounce';


const DashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<ILeadFilters>({
    status: 'All',
    source: 'All',
    search: '',
    sort: 'latest',
    page: 1,
    limit: 10,
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const { data, isLoading } = useLeads({
    ...filters,
    search: debouncedSearch,
  });

  const deleteLeadMutation = useDeleteLead();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleAddLead = () => {
    setSelectedLead(null);
    setIsFormOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsFormOpen(true);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailOpen(true);
  };

  const handleDeleteLead = (lead: Lead) => {
    if (window.confirm(`Are you sure you want to delete ${lead.name}?`)) {
      deleteLeadMutation.mutate(lead._id);
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <Layout>
      <div className="mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <AnimatedText as="h1" animation="text-reveal" className="text-lg font-heading font-semibold text-premium">
            Leads Dashboard
          </AnimatedText>
          <AnimatedText as="p" delay={80} className="text-premium-muted mt-1">
            Manage and track all your incoming leads
          </AnimatedText>
        </div>
      </div>

      <LeadFilters 
        filters={filters} 
        setFilters={setFilters} 
        onAddLead={handleAddLead} 
      />

      <LeadTable 
        leads={data?.data || []} 
        isLoading={isLoading}
        onView={handleViewLead}
        onEdit={handleEditLead}
        onDelete={handleDeleteLead}
        onAddLead={handleAddLead}
      />

      {data?.pagination && (
        <Pagination 
          currentPage={data.pagination.page}
          totalPages={data.pagination.totalPages}
          total={data.pagination.total}
          onPageChange={handlePageChange}
        />
      )}

      {/* Form Modal */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={selectedLead ? "Edit Lead" : "Add New Lead"}
      >
        <LeadForm 
          lead={selectedLead} 
          onClose={() => setIsFormOpen(false)} 
        />
      </Modal>

      {/* Detail Modal */}
      <Modal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        title="Lead Details"
      >
        <LeadDetailModal lead={selectedLead} />
      </Modal>
    </Layout>
  );
};

export default DashboardPage;
