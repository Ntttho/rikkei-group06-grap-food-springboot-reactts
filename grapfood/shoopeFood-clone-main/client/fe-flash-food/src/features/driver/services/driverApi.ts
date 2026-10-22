import { apiClient } from '@/services/apiClient';
import { Order } from '@/services/api/order';

export interface UpdateLocationPayload {
  latitude: number;
  longitude: number;
  heading?: number;
  speedKmh?: number;
  orderId?: number;
}

export const driverApi = {
  updateLocation: async (id: number, payload: UpdateLocationPayload): Promise<void> => {
    await apiClient.post(`/drivers/${id}/location`, payload);
  },
  setOnline: async (id: number): Promise<void> => {
    await apiClient.put(`/drivers/${id}/online/on`);
  },
  setOffline: async (id: number): Promise<void> => {
    await apiClient.put(`/drivers/${id}/online/off`);
  },
  getMyOrders: async (): Promise<{ active: Order[]; available: Order[] }> => {
    const res = await apiClient.get('/drivers/me/orders');
    return res.data?.data || { active: [], available: [] };
  },
};
