import React from 'react';
import { Bell, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context';

export const DashboardHeader: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
      <div className="text-lg font-bold text-slate-800">Dashboard</div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-primary transition-colors rounded-full hover:bg-slate-50">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="w-px h-6 bg-slate-200"></div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-slate-900">
              {user?.fullName || user?.name || 'Đối tác'}
            </span>
            <span className="text-xs text-slate-500 font-medium capitalize">
              {user?.role || 'Merchant'}
            </span>
          </div>
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center overflow-hidden">
            <UserIcon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
