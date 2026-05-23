import { Response } from 'express';
import { Lead } from '../models/lead.model';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../types';
import { generateLeadsCSV } from '../utils/csvExport';
import { buildLeadQuery, parsePagination } from '../utils/buildLeadQuery';
import { getPaginationMeta } from '../utils/pagination';
import { sendSuccess } from '../utils/apiResponse';

export const getLeads = asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = buildLeadQuery(req);
  const { page, limit, skip, sort } = parsePagination(req.query);

  const total = await Lead.countDocuments(query);
  const leads = await Lead.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'name email');

  sendSuccess(res, 'Leads fetched successfully', leads, 200, getPaginationMeta(total, page, limit));
});

export const createLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, status, source } = req.body;

  const lead = await Lead.create({
    name,
    email,
    status,
    source,
    createdBy: req.user?._id,
  });

  sendSuccess(res, 'Lead created successfully', lead, 201);
});

export const getLeadById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const filter: Record<string, unknown> = { _id: req.params.id };
  if (req.user?.role === 'sales') {
    filter.createdBy = req.user._id;
  }

  const lead = await Lead.findOne(filter).populate('createdBy', 'name email');
  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  sendSuccess(res, 'Lead fetched successfully', lead);
});

export const updateLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const filter: Record<string, unknown> = { _id: req.params.id };
  if (req.user?.role === 'sales') {
    filter.createdBy = req.user._id;
  }

  const lead = await Lead.findOne(filter);
  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  const { name, email, status, source } = req.body;
  const updatedLead = await Lead.findByIdAndUpdate(
    req.params.id,
    { name, email, status, source },
    { new: true, runValidators: true }
  ).populate('createdBy', 'name email');

  sendSuccess(res, 'Lead updated successfully', updatedLead);
});

export const deleteLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  await Lead.deleteOne({ _id: req.params.id });
  sendSuccess(res, 'Lead removed successfully');
});

export const exportLeadsCSV = asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = buildLeadQuery(req);
  const { sort } = parsePagination(req.query);
  const leads = await Lead.find(query).sort(sort);
  const csvData = generateLeadsCSV(leads);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
  res.status(200).send(csvData);
});
