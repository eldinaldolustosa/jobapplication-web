export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export type ApplicationStatus =
  | 'Enviado'
  | 'Feedback'
  | 'Entrevista'
  | 'Entrevista Técnica'
  | 'Negociação'
  | 'Contrato'
  | 'Rejeitado';

export interface JobApplication {
  _id: string;
  userId: string;
  company: string;
  position: string;
  location?: string;
  url?: string;
  status: ApplicationStatus;
  notes?: string;
  resumePath?: string;
  stages?: Stage[];
  createdAt: string;
  updatedAt: string;
}

export interface Stage {
  _id: string;
  applicationId: string;
  stage: ApplicationStatus;
  notes?: string;
  date: string;
  createdAt: string;
}

export interface LinkedinCompany {
  _id: string;
  userId: string;
  name: string;
  linkedinUrl?: string;
  industry?: string;
  size?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LinkedinContact {
  _id: string;
  userId: string;
  name: string;
  role?: string;
  company?: string;
  linkedinUrl?: string;
  email?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
