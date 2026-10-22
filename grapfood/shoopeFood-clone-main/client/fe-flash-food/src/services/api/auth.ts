import { apiClient } from '../apiClient';
import { User, UserRole } from '@/features/auth/types/auth.types';

export interface LoginPayload {
  phone: string;
  password?: string;
  role: UserRole;
}

export interface RegisterPayload {
  fullName: string;
  phone: string;
  password?: string;
  role?: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    // Map role to uppercase for backend compatibility
    const apiPayload = {
      ...payload,
      role: payload.role.toUpperCase(),
    };
    const response = await apiClient.post<{ data: AuthResponse; message?: string }>(
      '/auth/login',
      apiPayload
    );
    return response.data.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const apiPayload = {
      ...payload,
      role: payload.role ? payload.role.toUpperCase() : 'CUSTOMER',
    };
    const response = await apiClient.post<{ data: AuthResponse; message?: string }>(
      '/auth/register',
      apiPayload
    );
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
