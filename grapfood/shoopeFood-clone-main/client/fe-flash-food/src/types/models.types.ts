export interface Category {
  id: number;
  name: string;
  restaurantId?: number;
  image?: string;
  description?: string;
}

export interface SystemSetting {
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
}

export interface Restaurant {
  id: number;
  ownerId?: number;
  name: string;
  address: string;
  imageUrl?: string;
  ratingAvg: number;
  latitude: number;
  longitude: number;
  status: 'OPEN' | 'CLOSED';
  isOpen: boolean;
  openingTime: string;
  closingTime: string;
  distanceKm?: number;
  deliveryTime?: string;
}

export interface Topping {
  id: number;
  name: string;
  price: number;
  restaurantId?: number;
  isAvailable?: boolean;
  defaultQuantity?: number;
  currentQuantity?: number;
  startDate?: string | null;
  endDate?: string | null;
}

export interface Food {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  imageUrl?: string;
  defaultQuantity?: number;
  currentQuantity?: number;
  isAvailable?: boolean;
  toppings?: Topping[];
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
