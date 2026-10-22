import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth, useRestaurant, useCart } from '@/context';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Store,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MapPin,
  Users,
} from 'lucide-react';
import { cn } from '@/utils';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  const { selectedRestaurantId } = useRestaurant();
  const { clearCart } = useCart();

  const handleLogout = () => {
    logout();
    clearCart();
  };

  const merchantMenuItems = [
    {
      name: 'Cửa hàng của tôi',
      path: '/merchant/restaurants',
      icon: Store,
      requireSelected: false,
    },
    {
      name: 'Tổng quan',
      path: '/merchant/dashboard',
      icon: LayoutDashboard,
      requireSelected: true,
    },
    { name: 'Đơn hàng', path: '/merchant/orders', icon: ShoppingBag, requireSelected: true },
    { name: 'Thực đơn', path: '/merchant/menu', icon: UtensilsCrossed, requireSelected: true },
    { name: 'Thiết lập', path: '/merchant/store', icon: Store, requireSelected: true },
  ];

  const adminMenuItems = [
    { name: 'Tổng quan', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Quản lý Người dùng', path: '/admin/users', icon: Users },
  ];

  const driverMenuItems = [
    { name: 'Tổng quan', path: '/driver/dashboard', icon: LayoutDashboard },
    { name: 'Bản đồ', path: '/driver/map', icon: MapPin },
  ];

  const userRole = user?.role?.toLowerCase();

  const menuItems =
    userRole === 'admin'
      ? adminMenuItems
      : userRole === 'driver'
        ? driverMenuItems
        : merchantMenuItems;

  return (
    <div
      className={cn(
        'h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300 relative',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-slate-100 shrink-0">
        {isCollapsed ? (
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-black text-xl">
            F
          </div>
        ) : (
          <div className="text-2xl font-black text-primary">FlashFood</div>
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1 text-slate-500 hover:text-primary hover:border-primary transition-colors z-10"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;

          // Disable merchant items if no restaurant is selected
          const isDisabled =
            'requireSelected' in item && item.requireSelected && !selectedRestaurantId;

          return isDisabled ? (
            <div
              key={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl transition-colors font-medium opacity-50 cursor-not-allowed',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </div>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl transition-colors font-medium',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  isCollapsed && 'justify-center'
                )
              }
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-100 shrink-0">
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors font-bold',
            isCollapsed && 'justify-center'
          )}
          title={isCollapsed ? 'Đăng xuất' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};
