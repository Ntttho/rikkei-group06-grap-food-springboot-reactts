import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { ChangeRequest } from '../types/admin.types';
import { Restaurant } from '@/types';
import { Store, Edit, CheckCircle, XCircle, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'change-requests'>('pending');
  const [pendingRestaurants, setPendingRestaurants] = useState<Restaurant[]>([]);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchPendingRestaurants = async () => {
    try {
      const data = await adminApi.getPendingRestaurants();
      setPendingRestaurants(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChangeRequests = async () => {
    try {
      const data = await adminApi.getChangeRequests('PENDING');
      setChangeRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      await Promise.all([fetchPendingRestaurants(), fetchChangeRequests()]);
      setIsLoading(false);
    };
    loadInitialData();
  }, []);

  const handleApproveRestaurant = async (id: number) => {
    if (!window.confirm('Xác nhận duyệt quán ăn này?')) return;
    setProcessingId(id);
    try {
      await adminApi.approveRestaurant(id);
      await fetchPendingRestaurants();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      alert(errorObj?.response?.data?.message || 'Lỗi khi duyệt');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectRestaurant = async (id: number) => {
    const reason = window.prompt('Nhập lý do từ chối:');
    if (reason === null) return;
    setProcessingId(id);
    try {
      await adminApi.rejectRestaurant(id, reason);
      await fetchPendingRestaurants();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      alert(errorObj?.response?.data?.message || 'Lỗi khi từ chối');
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveChange = async (id: number) => {
    if (!window.confirm('Xác nhận duyệt yêu cầu thay đổi này?')) return;
    setProcessingId(id);
    try {
      await adminApi.approveChangeRequest(id);
      await fetchChangeRequests();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      alert(errorObj?.response?.data?.message || 'Lỗi khi duyệt');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectChange = async (id: number) => {
    const reason = window.prompt('Nhập lý do từ chối:');
    if (reason === null) return;
    setProcessingId(id);
    try {
      await adminApi.rejectChangeRequest(id, reason);
      await fetchChangeRequests();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      alert(errorObj?.response?.data?.message || 'Lỗi khi từ chối');
    } finally {
      setProcessingId(null);
    }
  };

  const renderPayload = (payload: Record<string, unknown>) => {
    return (
      <div className="space-y-1 mt-2 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
        {Object.entries(payload).map(([key, value]) => (
          <div key={key} className="flex gap-2">
            <span className="font-semibold text-slate-700 capitalize">{key}:</span>
            <span className="text-slate-600">{String(value)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Admin Control Center
          </h1>
          <p className="mt-2 text-indigo-200 font-medium max-w-lg">
            Trung tâm Giám sát và Phê duyệt Toàn hệ thống FlashFood.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Store className="w-32 h-32" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-2xl shadow-sm border border-slate-100 p-1.5 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pending')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap',
            activeTab === 'pending'
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-slate-500 hover:bg-slate-50'
          )}
        >
          <Store className="w-4 h-4" />
          Quán chờ duyệt ({pendingRestaurants.length})
        </button>
        <button
          onClick={() => setActiveTab('change-requests')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap',
            activeTab === 'change-requests'
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-slate-500 hover:bg-slate-50'
          )}
        >
          <Edit className="w-4 h-4" />
          Yêu cầu cập nhật ({changeRequests.length})
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-6 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : activeTab === 'pending' ? (
          <div className="space-y-4">
            {pendingRestaurants.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                Không có quán ăn nào đang chờ duyệt.
              </div>
            ) : (
              pendingRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-colors gap-4"
                >
                  <div className="flex-1 space-y-1">
                    <h3 className="font-bold text-lg text-slate-900">{restaurant.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {restaurant.address}
                    </div>
                    <div className="text-sm text-slate-500">
                      Chủ quán ID:{' '}
                      <span className="font-semibold text-slate-700">{restaurant.ownerId}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      disabled={processingId === restaurant.id}
                      onClick={() => handleRejectRestaurant(restaurant.id)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> Từ chối
                    </button>
                    <button
                      disabled={processingId === restaurant.id}
                      onClick={() => handleApproveRestaurant(restaurant.id)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" /> Phê duyệt
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {changeRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                Không có yêu cầu thay đổi nào đang chờ duyệt.
              </div>
            ) : (
              changeRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col sm:flex-row items-start justify-between p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-colors gap-4"
                >
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-slate-900">
                        Yêu cầu cập nhật quán ID: {req.restaurantId}
                      </h3>
                      <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-700 rounded-lg">
                        PENDING
                      </span>
                    </div>
                    {renderPayload(req.payload)}
                    <div className="text-xs text-slate-400 mt-2">
                      Ngày tạo: {new Date(req.createdAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto sm:self-center">
                    <button
                      disabled={processingId === req.id}
                      onClick={() => handleRejectChange(req.id)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> Từ chối
                    </button>
                    <button
                      disabled={processingId === req.id}
                      onClick={() => handleApproveChange(req.id)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" /> Phê duyệt
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
