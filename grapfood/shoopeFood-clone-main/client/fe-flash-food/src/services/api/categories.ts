import { apiClient } from '../apiClient';
import { ApiResponse, Category } from '@/types';

export const getCategories = async (params?: { restaurantId?: number }): Promise<Category[]> => {
  const response = await apiClient.get<ApiResponse<Category[]>>('/categories', { params });
  return response.data.data;
};

export const createCategory = async (data: {
  name: string;
  restaurantId: number;
}): Promise<Category> => {
  const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
  return response.data.data;
};

export const updateCategory = async (id: number, data: { name: string }): Promise<Category> => {
  const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data);
  return response.data.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};
