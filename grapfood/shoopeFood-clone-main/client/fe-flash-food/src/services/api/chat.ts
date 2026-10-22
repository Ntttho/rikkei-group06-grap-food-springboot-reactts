import { apiClient } from '../apiClient';

export interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  shopId: number;
  shopName: string;
  orderId?: number;
  message: string;
  senderRole: 'CUSTOMER' | 'MERCHANT';
  isRead: boolean;
  createdAt: string;
}

export interface SendMessagePayload {
  shopId: number;
  orderId?: number;
  message: string;
}

export const chatApi = {
  sendMessage: async (payload: SendMessagePayload): Promise<ChatMessage> => {
    const res = await apiClient.post<{ data: ChatMessage }>('/chat/messages', payload);
    return res.data.data;
  },
  getMessagesByShop: async (shopId: number, orderId?: number): Promise<ChatMessage[]> => {
    const params = orderId ? { orderId } : {};
    const res = await apiClient.get<{ data: ChatMessage[] }>(`/chat/restaurants/${shopId}`, { params });
    return res.data.data;
  },
  getMessagesByOrder: async (orderId: number): Promise<ChatMessage[]> => {
    const res = await apiClient.get<{ data: ChatMessage[] }>(`/chat/orders/${orderId}`);
    return res.data.data;
  },
};
