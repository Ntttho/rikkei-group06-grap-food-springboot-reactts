import { apiClient } from '@/services/apiClient';
import { ApiResponse, Restaurant } from '@/types';
import { ChangeRequest } from '../types/admin.types';

export const adminApi = {
  // Pending Restaurants
  getPendingRestaurants: async (): Promise<Restaurant[]> => {
    const response = await apiClient.get<ApiResponse<Restaurant[]>>('/restaurants/admin/pending');
    return response.data.data;
  },

  approveRestaurant: async (id: number): Promise<Restaurant> => {
    const response = await apiClient.patch<ApiResponse<Restaurant>>(
      `/restaurants/admin/${id}/approve`
    );
    return response.data.data;
  },

  rejectRestaurant: async (id: number, reason: string): Promise<Restaurant> => {
    const response = await apiClient.patch<ApiResponse<Restaurant>>(
      `/restaurants/admin/${id}/reject`,
      { reason }
    );
    return response.data.data;
  },

  // Change Requests
  getChangeRequests: async (
    status: 'PENDING' | 'APPROVED' | 'REJECTED' = 'PENDING'
  ): Promise<ChangeRequest[]> => {
    const response = await apiClient.get<ApiResponse<ChangeRequest[]>>(
      '/restaurants/admin/change-requests',
      {
        params: { status },
      }
    );
    return response.data.data;
  },

  approveChangeRequest: async (
    id: number
  ): Promise<{ changeRequest: ChangeRequest; restaurant: Restaurant }> => {
    const response = await apiClient.patch<
      ApiResponse<{ changeRequest: ChangeRequest; restaurant: Restaurant }>
    >(`/restaurants/admin/change-requests/${id}/approve`);
    return response.data.data;
  },

  rejectChangeRequest: async (id: number, reason: string): Promise<ChangeRequest> => {
    const response = await apiClient.patch<ApiResponse<ChangeRequest>>(
      `/restaurants/admin/change-requests/${id}/reject`,
      { reason }
    );
    return response.data.data;
  },
};
