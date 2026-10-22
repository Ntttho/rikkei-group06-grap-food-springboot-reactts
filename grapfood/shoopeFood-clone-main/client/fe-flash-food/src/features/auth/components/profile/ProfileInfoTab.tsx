import React from 'react';
import { MapPin, Edit } from 'lucide-react';
import { User } from '@/features/auth/types/auth.types';

interface ProfileInfoTabProps {
  user: User | null;
  onOpenEditModal: () => void;
}

export const ProfileInfoTab: React.FC<ProfileInfoTabProps> = ({ user, onOpenEditModal }) => {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-900">Hồ sơ cá nhân</h3>
        <button
          onClick={onOpenEditModal}
          className="text-primary hover:text-rose-700 text-sm font-bold flex items-center gap-1 transition-colors"
        >
          <Edit className="w-4 h-4" /> Cập nhật
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Họ và Tên</label>
          <div className="p-3 bg-slate-50 rounded-xl font-medium text-slate-800">
            {user?.fullName || user?.name || 'Nguyễn Văn A'}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Số điện thoại
          </label>
          <div className="p-3 bg-slate-50 rounded-xl font-medium text-slate-800">
            {user?.phone || '0987.654.321'}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
          <div className="p-3 bg-slate-50 rounded-xl font-medium text-slate-800">
            {user?.email || 'khachhang@flashfood.vn'}
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mt-10 mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" /> Sổ địa chỉ
      </h3>
      <div className="border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-slate-900">Nhà riêng</span>
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
              Mặc định
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Tòa nhà The Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh
          </p>
        </div>
      </div>
    </div>
  );
};
