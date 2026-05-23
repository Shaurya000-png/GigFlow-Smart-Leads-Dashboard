import axiosInstance from './axiosInstance';
import { LeadFilters, LeadsResponse } from '../types';

export const fetchLeads = async (filters: LeadFilters): Promise<LeadsResponse> => {
  const response = await axiosInstance.get('/leads', { params: filters });
  return response.data;
};

export const createLead = async (data: any) => {
  const response = await axiosInstance.post('/leads', data);
  return response.data;
};

export const updateLead = async (id: string, data: any) => {
  const response = await axiosInstance.put(`/leads/${id}`, data);
  return response.data;
};

export const deleteLead = async (id: string) => {
  const response = await axiosInstance.delete(`/leads/${id}`);
  return response.data;
};
