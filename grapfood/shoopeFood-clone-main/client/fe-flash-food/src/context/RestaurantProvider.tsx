import React from 'react';
import { RestaurantContext } from './RestaurantContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedRestaurantId, setSelectedRestaurantId] = useLocalStorage<number | null>(
    'flashfood_merchant_selected_restaurant_id',
    null
  );

  return (
    <RestaurantContext.Provider value={{ selectedRestaurantId, setSelectedRestaurantId }}>
      {children}
    </RestaurantContext.Provider>
  );
};
