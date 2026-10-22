import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context';
import { UserRole } from '@/features/auth/types/auth.types';

export interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, redirectPath }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath || '/login'} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role.toLowerCase() as UserRole)) {
    // If authenticated but wrong role, redirect to appropriate home
    const role = user.role.toLowerCase();
    const fallbackPath =
      role === 'merchant'
        ? '/merchant/dashboard'
        : role === 'driver'
          ? '/driver/dashboard'
          : role === 'admin'
            ? '/admin/dashboard'
            : '/app';

    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};
