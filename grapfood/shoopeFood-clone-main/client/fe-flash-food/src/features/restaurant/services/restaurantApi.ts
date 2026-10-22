import { apiClient } from '@/services/apiClient';
import { Restaurant, ApiResponse, Category, Food } from '@/types';

export interface GetRestaurantsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export const restaurantApi = {
  getRestaurants: async (params?: GetRestaurantsParams) => {
    const response = await apiClient.get<ApiResponse<Restaurant[]>>('/restaurants', { params });
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  getRestaurantById: async (id: string | number) => {
    const response = await apiClient.get<{ data: Restaurant }>(`/restaurants/${id}`);
    return response.data;
  },

  getMenu: async (restaurantId: string | number) => {
    const response = await apiClient.get<ApiResponse<Food[]>>(`/foods`, {
      params: { restaurantId },
    });
    return response.data;
  },

  getCategories: async (restaurantId: string | number) => {
    const response = await apiClient.get<ApiResponse<Category[]>>(`/categories`, {
      params: { restaurantId },
    });
    return response.data;
  },
};
