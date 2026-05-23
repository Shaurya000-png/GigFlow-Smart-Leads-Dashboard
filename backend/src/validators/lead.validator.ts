import { z } from 'zod';

const leadStatus = z.enum(['New', 'Contacted', 'Qualified', 'Lost']);
const leadSource = z.enum(['Website', 'Instagram', 'Referral']);

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  status: leadStatus.optional().default('New'),
  source: leadSource,
});

export const updateLeadSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    status: leadStatus.optional(),
    source: leadSource.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update',
  });

export const leadQuerySchema = z.object({
  status: z.string().optional(),
  source: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['latest', 'oldest']).optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});
