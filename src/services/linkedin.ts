import { api } from '@/lib/api';
import { LinkedinCompany, LinkedinContact } from '@/types';

export const linkedinService = {
  // Companies
  async listCompanies(): Promise<LinkedinCompany[]> {
    const { data } = await api.get('/api/v1/linkedin/companies');
    return data;
  },

  async createCompany(payload: Partial<LinkedinCompany>): Promise<LinkedinCompany> {
    const { data } = await api.post('/api/v1/linkedin/companies', payload);
    return data;
  },

  async updateCompany(id: string, payload: Partial<LinkedinCompany>): Promise<LinkedinCompany> {
    const { data } = await api.put(`/api/v1/linkedin/companies/${id}`, payload);
    return data;
  },

  async deleteCompany(id: string): Promise<void> {
    await api.delete(`/api/v1/linkedin/companies/${id}`);
  },

  // Contacts
  async listContacts(): Promise<LinkedinContact[]> {
    const { data } = await api.get('/api/v1/linkedin/contacts');
    return data;
  },

  async createContact(payload: Partial<LinkedinContact>): Promise<LinkedinContact> {
    const { data } = await api.post('/api/v1/linkedin/contacts', payload);
    return data;
  },

  async updateContact(id: string, payload: Partial<LinkedinContact>): Promise<LinkedinContact> {
    const { data } = await api.put(`/api/v1/linkedin/contacts/${id}`, payload);
    return data;
  },

  async deleteContact(id: string): Promise<void> {
    await api.delete(`/api/v1/linkedin/contacts/${id}`);
  },
};
