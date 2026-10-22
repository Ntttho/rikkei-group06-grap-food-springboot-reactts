import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, CartProvider, RestaurantProvider } from '@/context';
import { router } from '@/routes';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <RestaurantProvider>
          <RouterProvider router={router} />
          <Toaster position="top-center" richColors />
        </RestaurantProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
