import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useRestaurant } from '@/context';
import { getMyRestaurants, updateRestaurant } from '@/services/api';
import { Restaurant } from '@/types';
import { Button } from '@/components';
import { Store, MapPin, Clock, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type DefaultIcon = L.Icon.Default & {
  _getIconUrl?: string;
};
delete (L.Icon.Default.prototype as DefaultIcon)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// A component to handle map clicks and update marker
const LocationPicker: React.FC<{
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
}> = ({ position, setPosition }) => {
  const markerRef = useRef<L.Marker>(null);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          setPosition([latLng.lat, latLng.lng]);
        }
      },
    }),
    [setPosition]
  );

  return (
    <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef} />
  );
};

export const RestaurantForm: React.FC = () => {
  const { selectedRestaurantId } = useRestaurant();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [position, setPosition] = useState<[number, number]>([10.7769, 106.7009]); // Default HCMC

  useEffect(() => {
    if (selectedRestaurantId) {
      fetchRestaurant();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRestaurantId]);

  const fetchRestaurant = async () => {
    if (!selectedRestaurantId) return;
    try {
      setIsLoading(true);
      const myRestaurants = await getMyRestaurants();
      const res = myRestaurants.find((r) => r.id === selectedRestaurantId);

      if (res) {
        setRestaurant(res);
        setName(res.name);
        setAddress(res.address);
        setImageUrl(res.imageUrl || '');
        setIsOpen(res.isOpen);
        setOpeningTime(res.openingTime.slice(0, 5));
        setClosingTime(res.closingTime.slice(0, 5));
        setPosition([res.latitude, res.longitude]);
      }
    } catch {
      setError('Không thể tải thông tin cửa hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) return;

    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const payload: Partial<Restaurant> = {
        name,
        address,
        imageUrl,
        isOpen,
        openingTime: `${openingTime}:00`,
        closingTime: `${closingTime}:00`,
        latitude: position[0],
        longitude: position[1],
      };

      const res = await updateRestaurant(restaurant.id, payload);

      if (res.changeRequest) {
        setSuccess(
          'Cập nhật thành công! Yêu cầu thay đổi Tên/Địa chỉ/Tọa độ đã được gửi cho Admin phê duyệt.'
        );
      } else {
        setSuccess('Đã cập nhật thông tin cửa hàng thành công.');
      }

      // Update local state if direct updates
      if (res.restaurant) {
        setRestaurant(res.restaurant);
        setImageUrl(res.restaurant.imageUrl || '');
        setIsOpen(res.restaurant.isOpen);
        setOpeningTime(res.restaurant.openingTime.slice(0, 5));
        setClosingTime(res.restaurant.closingTime.slice(0, 5));
        // Note: name, address, lat, lng might not update immediately if pending approval
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        const errorObj = err as { response?: { data?: { message?: string } } };
        setError(errorObj?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedRestaurantId) {
    return <Navigate to="/merchant/restaurants" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800">Không tìm thấy thông tin cửa hàng</h3>
        <p className="text-slate-500 mt-2">Vui lòng liên hệ Admin để được cấp quyền chủ quán.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Store className="w-6 h-6 text-primary" /> Thông tin Cửa hàng
          </h1>
          <p className="text-slate-500 mt-1">Cập nhật thông tin chi tiết về nhà hàng của bạn</p>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-primary hover:bg-orange-600 font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/30"
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-start gap-2 border border-green-200">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Thành công</p>
            <p className="text-sm">{success}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
        {/* Cột Trái: Thông tin cơ bản */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-5">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
            Thông tin Cơ bản
          </h2>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Tên cửa hàng *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
            <p className="text-xs text-slate-400 mt-1">
              Lưu ý: Thay đổi tên cần được Admin phê duyệt.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Địa chỉ *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
            <p className="text-xs text-slate-400 mt-1">
              Lưu ý: Thay đổi địa chỉ cần được Admin phê duyệt.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
              <ImageIcon className="w-4 h-4" /> Link Ảnh Đại Diện
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {imageUrl && (
              <div className="mt-3 w-full h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/400x200?text=Lỗi+ảnh';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Cột Phải: Hoạt động & Bản đồ */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
              Trạng thái Hoạt động
            </h2>

            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isOpen}
                  onChange={(e) => setIsOpen(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
              <span className={`font-bold ${isOpen ? 'text-emerald-600' : 'text-slate-500'}`}>
                {isOpen ? 'Đang mở cửa nhận đơn' : 'Đang tạm nghỉ'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Giờ mở cửa
                </label>
                <input
                  type="time"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Giờ đóng cửa
                </label>
                <input
                  type="time"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Vị trí trên Bản đồ
            </h2>
            <p className="text-sm text-slate-500">
              Kéo thả ghim để đánh dấu vị trí chính xác của cửa hàng.
            </p>

            <div className="h-64 rounded-xl overflow-hidden border border-slate-200 z-0 relative">
              <MapContainer
                center={position}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Vĩ độ (Lat)</label>
                <input
                  type="number"
                  value={position[0]}
                  readOnly
                  className="w-full px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Kinh độ (Lng)</label>
                <input
                  type="number"
                  value={position[1]}
                  readOnly
                  className="w-full px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
