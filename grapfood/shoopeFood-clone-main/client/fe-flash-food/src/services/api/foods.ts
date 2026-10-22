import { apiClient } from '../apiClient';
import { ApiResponse, Food } from '@/types';

export const getFoods = async (params?: {
  restaurantId?: number;
  categoryId?: number;
}): Promise<Food[]> => {
  const response = await apiClient.get<ApiResponse<Food[]>>('/foods', { params });
  return response.data.data;
};

export const createFood = async (data: {
  name: string;
  price: number;
  categoryId: number;
  imageUrl?: string;
  isAvailable?: boolean;
  defaultQuantity?: number;
  currentQuantity?: number;
}): Promise<Food> => {
  const response = await apiClient.post<ApiResponse<Food>>('/foods', data);
  return response.data.data;
};

export const updateFood = async (
  id: number,
  data: {
    name?: string;
    price?: number;
    categoryId?: number;
    imageUrl?: string;
    isAvailable?: boolean;
    defaultQuantity?: number;
    currentQuantity?: number;
  }
): Promise<Food> => {
  const response = await apiClient.put<ApiResponse<Food>>(`/foods/${id}`, data);
  return response.data.data;
};

export const deleteFood = async (id: number): Promise<void> => {
  await apiClient.delete(`/foods/${id}`);
};
