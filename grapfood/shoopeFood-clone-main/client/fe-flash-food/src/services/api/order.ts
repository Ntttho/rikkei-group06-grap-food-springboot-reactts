import { apiClient } from '../apiClient';
import { OrderStatus } from '@/constants/orderStatus';
export type { OrderStatus };

export interface OrderItemPayload {
  foodId: number;
  foodName: string;
  quantity: number;
  priceAtOrder: number;
  toppings?: Array<{
    id: number;
    toppingId: number;
    toppingName: string;
    priceAtOrder: number;
    quantity: number;
  }>;
}

export interface CreateOrderPayload {
  restaurantId: number;
  voucherId?: number;
  receiverAddress?: string;
  receiverLat?: number;
  receiverLng?: number;
  distanceKm?: number;
  baseFee?: number;
  discountAmount?: number;
  taxAmount?: number;
  shippingType?: 'STANDARD' | 'EXPRESS';
  orderCode?: string;
  idempotencyKey?: string;
  items: OrderItemPayload[];
}

// Define the Order interface returned by the backend
export interface Order {
  id: number;
  orderCode: string;
  restaurantId: number;
  customerId: number;
  driverId: number | null;
  voucherId: number | null;
  statusId: number;
  statusCode: OrderStatus;
  statusName: string;
  subTotal: number;
  shippingFee: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  receiverAddress: string;
  receiverLat: number;
  receiverLng: number;
  notes: string;
  distanceKm: number;
  estimatedDeliveryTime: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: number;
    fullName: string;
    phone: string;
  };
  restaurant?: {
    id: number;
    name: string;
    address: string;
  };
  driver?: {
    id: number;
    fullName: string;
    phone: string;
  };
  items: Array<{
    id: number;
    orderId: number;
    foodId: number;
    foodName: string;
    quantity: number;
    priceAtOrder: number;
    toppings?: Array<{
      id: number;
      toppingId: number;
      toppingName: string;
      priceAtOrder: number;
    }>;
  }>;
}

export interface GetOrdersParams {
  statusId?: number;
  statusCode?: OrderStatus;
  restaurantId?: number;
  customerId?: number;
  driverId?: number;
  fromDate?: string;
  toDate?: string;
}

export interface ValidateVoucherResponse {
  id: number;
  code: string;
  discountAmount: number;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  minOrderValue: number;
}

export const orderApi = {
  getOrders: async (params?: GetOrdersParams): Promise<Order[]> => {
    const response = await apiClient.get<{ data: Order[] }>('/orders', { params });
    return response.data.data;
  },

  getOrderById: async (id: number): Promise<Order> => {
    const response = await apiClient.get<{ data: Order }>(`/orders/${id}`);
    return response.data.data;
  },

  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const response = await apiClient.post<{ data: Order; message: string }>('/orders', payload);
    return response.data.data;
  },

  updateOrderStatus: async (id: number, statusCode: OrderStatus): Promise<Order> => {
    const response = await apiClient.put<{ data: Order; message: string }>(`/orders/${id}/status`, {
      statusCode,
    });
    return response.data.data;
  },

  acceptDriverOrder: async (id: number): Promise<Order> => {
    const response = await apiClient.post<{ data: Order; message: string }>(`/orders/${id}/accept`);
    return response.data.data;
  },

  rejectDriverOrder: async (id: number): Promise<void> => {
    await apiClient.post(`/orders/${id}/reject-offer`);
  },

  validateVoucher: async (code: string, subtotal: number): Promise<ValidateVoucherResponse> => {
    const response = await apiClient.post<{ data: ValidateVoucherResponse }>('/vouchers/validate', {
      code,
      subtotal,
    });
    return response.data.data;
  },
};
