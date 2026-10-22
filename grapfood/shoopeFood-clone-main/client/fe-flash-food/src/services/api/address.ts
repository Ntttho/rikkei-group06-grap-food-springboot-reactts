import { apiClient } from '../apiClient';

export interface UserAddress {
  id: number;
  address: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  label?: string;
  createdAt?: string;
}

export interface CreateAddressPayload {
  address: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
  label?: string;
}

export const addressApi = {
  getMine: async (): Promise<UserAddress[]> => {
    const res = await apiClient.get<{ data: UserAddress[] }>('/addresses/mine');
    return res.data.data;
  },
  createMine: async (payload: CreateAddressPayload): Promise<UserAddress> => {
    const res = await apiClient.post<{ data: UserAddress }>('/addresses/mine', payload);
    return res.data.data;
  },
  updateMine: async (id: number, payload: CreateAddressPayload): Promise<UserAddress> => {
    const res = await apiClient.put<{ data: UserAddress }>(`/addresses/mine/${id}`, payload);
    return res.data.data;
  },
  deleteMine: async (id: number): Promise<void> => {
    await apiClient.delete(`/addresses/mine/${id}`);
  },
};
