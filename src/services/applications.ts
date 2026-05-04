import { api } from '@/lib/api';
import { JobApplication, Stage } from '@/types';

export const applicationsService = {
  async list(): Promise<JobApplication[]> {
    const { data } = await api.get('/api/v1/candidatures');
    return data;
  },

  async get(id: string): Promise<JobApplication> {
    const { data } = await api.get(`/api/v1/candidatures/${id}`);
    return data;
  },

  async create(payload: Partial<JobApplication>): Promise<JobApplication> {
    const { data } = await api.post('/api/v1/candidatures', payload);
    return data;
  },

  async update(id: string, payload: Partial<JobApplication>): Promise<JobApplication> {
    const { data } = await api.put(`/api/v1/candidatures/${id}`, payload);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/v1/candidatures/${id}`);
  },

  async uploadResume(id: string, file: File): Promise<JobApplication> {
    const formData = new FormData();
    formData.append('resume', file);
    const { data } = await api.post(`/api/v1/candidatures/${id}/resume`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async getStages(id: string): Promise<Stage[]> {
    const { data } = await api.get(`/api/v1/candidatures/${id}/stages`);
    return data;
  },

  async addStage(id: string, payload: { stage: string; notes?: string; date?: string }): Promise<Stage> {
    const { data } = await api.post(`/api/v1/candidatures/${id}/stages`, payload);
    return data;
  },
};
