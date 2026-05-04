import { api } from '@/lib/api';
import { AuthTokens, LoginPayload, RegisterPayload, User } from '@/types';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthTokens> {
    const { data } = await api.post('/api/v1/auth/login', payload);
    return data;
  },

  async register(payload: RegisterPayload): Promise<User> {
    const { data } = await api.post('/api/v1/users/register', payload);
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get('/api/v1/users/me');
    return data;
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const { data } = await api.post('/api/v1/auth/refresh', { refreshToken });
    return data;
  },
};
