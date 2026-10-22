import React, { useState, useEffect } from 'react';
import { CartContext, CartItem } from './CartContext';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { Topping } from '@/types/models.types';
import { Modal } from '@/components/Modal';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendingItem, setPendingItem] = useState<CartItem | null>(null);

  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [restaurantId, setRestaurantId] = useState<number | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEYS.CART}_restaurant`);
    return saved ? Number(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    if (restaurantId) {
      localStorage.setItem(`${STORAGE_KEYS.CART}_restaurant`, restaurantId.toString());
    } else {
      localStorage.removeItem(`${STORAGE_KEYS.CART}_restaurant`);
    }
  }, [items, restaurantId]);

  const isSameToppings = (t1: Topping[], t2: Topping[]) => {
    if (t1.length !== t2.length) return false;
    const sorted1 = [...t1].sort((a, b) => a.id - b.id);
    const sorted2 = [...t2].sort((a, b) => a.id - b.id);
    return sorted1.every((t, i) => t.id === sorted2[i].id);
  };

  const addItem = (newItem: CartItem) => {
    if (restaurantId && restaurantId !== newItem.restaurantId) {
      setPendingItem(newItem);
      return;
    }

    if (!restaurantId) {
      setRestaurantId(newItem.restaurantId);
    }

    setItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.foodId === newItem.foodId && isSameToppings(item.toppings, newItem.toppings)
      );

      if (existingItemIndex >= 0) {
        const newItems = [...prev];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + newItem.quantity,
        };
        return newItems;
      }

      return [...prev, newItem];
    });
  };

  const removeItem = (foodId: number, toppings: Topping[]) => {
    setItems((prev) => {
      const newItems = prev.filter(
        (item) => !(item.foodId === foodId && isSameToppings(item.toppings, toppings))
      );
      if (newItems.length === 0) setRestaurantId(null);
      return newItems;
    });
  };

  const updateQuantity = (foodId: number, toppings: Topping[], quantity: number) => {
    if (quantity <= 0) {
      removeItem(foodId, toppings);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.foodId === foodId && isSameToppings(item.toppings, toppings)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const toppingsPrice = item.toppings.reduce((tSum, t) => tSum + t.price, 0);
    return sum + (item.price + toppingsPrice) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}

      {/* Restaurant Change Confirmation Modal */}
      <Modal
        isOpen={!!pendingItem}
        onClose={() => setPendingItem(null)}
        title="Bắt đầu đơn hàng mới?"
        hideCloseButton
      >
        <p className="text-slate-600 mb-6 leading-relaxed">
          Bạn đang có món ăn của một nhà hàng khác trong giỏ. Việc thêm món mới sẽ xóa toàn bộ giỏ
          hàng hiện tại. Bạn có chắc chắn muốn tiếp tục?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setPendingItem(null)}
            className="px-4 py-2 rounded-lg font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => {
              if (pendingItem) {
                setItems([pendingItem]);
                setRestaurantId(pendingItem.restaurantId);
                setPendingItem(null);
              }
            }}
            className="px-4 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            Đồng ý xóa
          </button>
        </div>
      </Modal>
    </CartContext.Provider>
  );
};
