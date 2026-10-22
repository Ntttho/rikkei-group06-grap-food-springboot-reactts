import React from 'react';
import { User as UserIcon, Package, MapPin } from 'lucide-react';
import { User } from '@/features/auth/types/auth.types';

interface ProfileSidebarProps {
  user: User | null;
  activeTab: 'info' | 'orders' | 'addresses';
  setActiveTab: (tab: 'info' | 'orders' | 'addresses') => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  user,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="w-full md:w-64 shrink-0">
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-500 overflow-hidden">
          <UserIcon className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          {user?.fullName || user?.name || 'Khách hàng'}
        </h2>
        <p className="text-slate-500 text-sm mb-6">{user?.phone || '0987.654.321'}</p>

        <div className="w-full flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${
              activeTab === 'info' ? 'bg-primary text-white font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            Thông tin
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${
              activeTab === 'addresses' ? 'bg-primary text-white font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-5 h-5" />
            Sổ địa chỉ
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-primary text-white font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Package className="w-5 h-5" />
            Lịch sử đơn
          </button>
        </div>
      </div>
    </div>
  );
};
