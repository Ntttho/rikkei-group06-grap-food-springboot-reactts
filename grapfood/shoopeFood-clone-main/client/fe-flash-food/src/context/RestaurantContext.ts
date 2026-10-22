import { createContext, useContext } from 'react';

interface RestaurantContextType {
  selectedRestaurantId: number | null;
  setSelectedRestaurantId: (id: number | null) => void;
}

export const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
