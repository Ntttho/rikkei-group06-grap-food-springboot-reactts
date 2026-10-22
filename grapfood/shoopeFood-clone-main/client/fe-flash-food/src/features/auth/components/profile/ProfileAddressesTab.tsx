import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Check, Home, Building2, Tag } from 'lucide-react';
import { addressApi, UserAddress } from '@/services/api/address';
import { toast } from 'sonner';

export const ProfileAddressesTab: React.FC = () => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('Nhà riêng');
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await addressApi.getMine();
      setAddresses(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải danh sách địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) {
      toast.error('Vui lòng nhập địa chỉ giao hàng');
      return;
    }

    try {
      setSubmitting(true);
      await addressApi.createMine({
        address: newAddress.trim(),
        label: newLabel,
        isDefault,
        latitude: 21.028511,
        longitude: 105.804817,
      });
      toast.success('Thêm địa chỉ thành công');
      setNewAddress('');
      setIsAdding(false);
      fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi thêm địa chỉ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetDefault = async (addr: UserAddress) => {
    try {
      await addressApi.updateMine(addr.id, {
        address: addr.address,
        label: addr.label,
        isDefault: true,
      });
      toast.success('Đã đặt làm địa chỉ mặc định');
      fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error('Không thể cập nhật địa chỉ mặc định');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    try {
      await addressApi.deleteMine(id);
      toast.success('Đã xóa địa chỉ');
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Không thể xóa địa chỉ');
    }
  };

  const getLabelIcon = (label?: string) => {
    switch (label?.toLowerCase()) {
      case 'văn phòng':
      case 'công ty':
        return <Building2 className="w-4 h-4 text-sky-500" />;
      case 'nhà riêng':
        return <Home className="w-4 h-4 text-emerald-500" />;
      default:
        return <Tag className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Sổ Địa Chỉ Giao Hàng</h2>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý địa chỉ nhận món giúp đặt hàng nhanh chóng và chính xác
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm địa chỉ</span>
          </button>
        )}
      </div>

      {/* Add Address Form */}
      {isAdding && (
        <form onSubmit={handleAddAddress} className="my-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Thêm địa chỉ nhận hàng mới</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Địa chỉ chi tiết</label>
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="VD: Số 144 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Loại địa chỉ</label>
              <select
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={submitting}
              >
                <option value="Nhà riêng">Nhà riêng</option>
                <option value="Văn phòng">Văn phòng / Công ty</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isDefault"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <label htmlFor="isDefault" className="text-sm font-medium text-slate-700 cursor-pointer">
                Đặt làm địa chỉ mặc định
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Đang lưu...' : 'Lưu địa chỉ'}
            </button>
          </div>
        </form>
      )}

      {/* Address List */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Đang tải địa chỉ...</div>
        ) : addresses.length === 0 ? (
          <div className="py-12 text-center">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Bạn chưa lưu địa chỉ nào</p>
            <p className="text-xs text-slate-400 mt-1">Hãy thêm địa chỉ để giao hàng nhanh chóng hơn</p>
          </div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                addr.isDefault
                  ? 'border-primary/40 bg-rose-50/20 shadow-xs'
                  : 'border-slate-100 hover:border-slate-200 bg-white'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {getLabelIcon(addr.label)}
                    {addr.label || 'Địa chỉ'}
                  </span>
                  {addr.isDefault && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Mặc định
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-800 flex items-start gap-2 pt-1">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{addr.address}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 sm:self-center shrink-0">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Thiết lập mặc định
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Xóa địa chỉ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
