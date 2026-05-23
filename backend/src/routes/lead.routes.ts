import { Router } from 'express';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/lead.controller';
import { protect } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createLeadSchema, leadQuerySchema, updateLeadSchema } from '../validators/lead.validator';

const router = Router();

router.use(protect);

router.get('/export/csv', requireRole('admin'), validate(leadQuerySchema, 'query'), exportLeadsCSV);
router.get('/', validate(leadQuerySchema, 'query'), getLeads);
router.post('/', validate(createLeadSchema), createLead);
router.get('/:id', getLeadById);
router.put('/:id', validate(updateLeadSchema), updateLead);
router.delete('/:id', requireRole('admin'), deleteLead);

export default router;
