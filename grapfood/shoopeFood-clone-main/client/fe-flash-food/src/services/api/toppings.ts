import { apiClient } from '../apiClient';
import { Topping } from '@/types/models.types';

export const getToppingsByRestaurant = async (restaurantId: number): Promise<Topping[]> => {
  const response = await apiClient.get(`/restaurants/${restaurantId}/toppings`);
  return response.data.data || [];
};

export const createTopping = async (
  restaurantId: number,
  data: Partial<Topping>
): Promise<Topping> => {
  const response = await apiClient.post(`/restaurants/${restaurantId}/toppings`, data);
  return response.data.data;
};

export const updateTopping = async (
  toppingId: number,
  data: Partial<Topping>
): Promise<Topping> => {
  const response = await apiClient.put(`/toppings/${toppingId}`, data);
  return response.data.data;
};

export const deleteTopping = async (toppingId: number): Promise<void> => {
  await apiClient.delete(`/toppings/${toppingId}`);
};

export const getToppingsByFood = async (foodId: number): Promise<Topping[]> => {
  const response = await apiClient.get(`/foods/${foodId}/toppings`);
  return response.data.data || [];
};

export const assignToppingsToFood = async (
  foodId: number,
  toppingIds: number[]
): Promise<Topping[]> => {
  const response = await apiClient.post(`/foods/${foodId}/toppings`, { toppingIds });
  return response.data.data || [];
};
