import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context';

export const PublicRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    const role = user.role.toLowerCase();
    const targetPath =
      role === 'merchant'
        ? '/merchant/dashboard'
        : role === 'driver'
          ? '/driver/dashboard'
          : role === 'admin'
            ? '/admin/dashboard'
            : '/app';

    return <Navigate to={targetPath} replace />;
  }

  return <Outlet />;
};
