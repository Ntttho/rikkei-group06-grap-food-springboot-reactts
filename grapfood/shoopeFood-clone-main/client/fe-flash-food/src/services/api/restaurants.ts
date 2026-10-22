import { apiClient } from '../apiClient';
import { ApiResponse, Restaurant, PaginationMetadata } from '@/types';

export const getRestaurants = async (params?: {
  categoryId?: number;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: Restaurant[]; pagination?: PaginationMetadata }> => {
  const response = await apiClient.get<ApiResponse<Restaurant[]>>('/restaurants', { params });
  return {
    items: response.data.data,
    pagination: response.data.pagination,
  };
};

export const getMyRestaurants = async (): Promise<Restaurant[]> => {
  const response = await apiClient.get<ApiResponse<Restaurant[]>>('/restaurants/mine');
  return response.data.data;
};

export const updateRestaurant = async (
  id: number,
  data: Partial<Restaurant>
): Promise<{ restaurant: Restaurant; changeRequest?: unknown }> => {
  const response = await apiClient.put<
    ApiResponse<{ restaurant: Restaurant; changeRequest?: unknown }>
  >(`/restaurants/${id}`, data);
  return response.data.data;
};
