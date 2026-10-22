import { createContext, useContext } from 'react';
import { Topping } from '@/types/models.types';

export interface CartItem {
  foodId: number;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  toppings: Topping[];
  restaurantId: number;
}

export interface CartContextType {
  items: CartItem[];
  restaurantId: number | null;
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (foodId: number, toppings: Topping[]) => void;
  updateQuantity: (foodId: number, toppings: Topping[], quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | null>(null);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
