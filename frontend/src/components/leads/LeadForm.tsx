import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Lead } from '../../types';
import { useCreateLead, useUpdateLead } from '../../hooks/useLeads';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadFormProps {
  lead?: Lead | null;
  onClose: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ lead, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: 'New',
      source: 'Website',
    }
  });

  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
      });
    } else {
      reset({ status: 'New', source: 'Website', name: '', email: '' });
    }
  }, [lead, reset]);

  const onSubmit = (data: LeadFormValues) => {
    if (lead) {
      updateMutation.mutate({ id: lead._id, data }, {
        onSuccess: () => onClose()
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => onClose()
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input 
        label="Full Name" 
        {...register('name')} 
        error={errors.name?.message} 
      />
      <Input 
        label="Email Address" 
        type="email" 
        {...register('email')} 
        error={errors.email?.message} 
      />
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-2xs font-medium text-textMuted uppercase tracking-label mb-1.5">Status</label>
          <select
            {...register('status')}
            className="filter-select w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
          {errors.status && <p className="mt-1 text-2xs text-red-400">{errors.status.message}</p>}
        </div>
        <div>
          <label className="block text-2xs font-medium text-textMuted uppercase tracking-label mb-1.5">Source</label>
          <select
            {...register('source')}
            className="filter-select w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
          {errors.source && <p className="mt-1 text-2xs text-red-400">{errors.source.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
        <Button variant="secondary" type="button" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isPending}>
          {lead ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};
