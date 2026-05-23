import mongoose, { Document, Schema } from 'mongoose';
import { ILead } from '../types';

export interface ILeadDocument extends Omit<ILead, '_id'>, Document {}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'],
      required: [true, 'Source is required'],
    },
    createdBy: {
      type: String,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query performance
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdBy: 1 });

export const Lead = mongoose.model<ILeadDocument>('Lead', leadSchema);
