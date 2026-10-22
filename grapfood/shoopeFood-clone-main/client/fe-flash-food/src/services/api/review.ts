import { apiClient } from '../apiClient';

export interface ReviewItem {
  id: number;
  orderId: number;
  customer?: {
    id: number;
    fullName?: string;
    phone?: string;
  };
  targetType: 'RESTAURANT' | 'DRIVER';
  targetId: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface CreateReviewPayload {
  orderId: number;
  targetType: 'RESTAURANT' | 'DRIVER';
  targetId: number;
  rating: number;
  comment?: string;
}

export const reviewApi = {
  createReview: async (payload: CreateReviewPayload): Promise<ReviewItem> => {
    const res = await apiClient.post<{ data: ReviewItem }>('/reviews', payload);
    return res.data.data;
  },
  getRestaurantReviews: async (restaurantId: number): Promise<ReviewItem[]> => {
    const res = await apiClient.get<{ data: ReviewItem[] }>(`/reviews/restaurants/${restaurantId}`);
    return res.data.data;
  },
  getRestaurantSummary: async (
    restaurantId: number
  ): Promise<{ totalReviews: number; averageRating: number; reviews: ReviewItem[] }> => {
    const res = await apiClient.get<{
      data: { totalReviews: number; averageRating: number; reviews: ReviewItem[] };
    }>('/reviews/restaurants/summary', {
      params: { restaurantId },
    });
    return res.data.data;
  },
};
