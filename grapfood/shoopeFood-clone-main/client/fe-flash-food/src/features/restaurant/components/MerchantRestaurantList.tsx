import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyRestaurants } from '@/services/api';
import { Restaurant } from '@/types';
import { Store, Plus, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { useRestaurant } from '@/context';
import { Button } from '@/components';

export const MerchantRestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { setSelectedRestaurantId } = useRestaurant();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getMyRestaurants();
        setRestaurants(data);
      } catch (err) {
        console.error('Failed to load restaurants', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleSelectRestaurant = (id: number) => {
    setSelectedRestaurantId(id);
    navigate('/merchant/dashboard');
  };

  const handleCreateNew = () => {
    alert('Tính năng tạo chi nhánh mới sẽ sớm ra mắt!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Store className="w-8 h-8" /> Hệ thống Cửa hàng
          </h1>
          <p className="mt-2 text-orange-100 font-medium max-w-lg">
            Quản lý tất cả các chi nhánh của bạn tại một nơi duy nhất.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="relative z-10 bg-white text-orange-600 hover:bg-orange-50 font-bold shadow-md rounded-xl px-4 py-2.5 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" /> Thêm Chi Nhánh
        </button>
        <div className="absolute -bottom-8 -right-8 p-8 opacity-10">
          <Store className="w-48 h-48" />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <p className="font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
            <Store className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800">Bạn chưa có cửa hàng nào</h3>
            <p className="text-slate-500 mt-2 mb-6">
              Hãy tạo cửa hàng đầu tiên để bắt đầu bán hàng.
            </p>
            <Button
              onClick={handleCreateNew}
              className="bg-primary hover:bg-orange-600 font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-orange-500/30 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Tạo cửa hàng ngay
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="group border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col bg-white"
              >
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                  <img
                    src={restaurant.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        restaurant.isOpen ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-white'
                      }`}
                    >
                      {restaurant.isOpen ? 'Mở cửa' : 'Đóng cửa'}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                    {restaurant.name}
                  </h3>
                  <div className="flex items-start gap-1.5 text-slate-500 mt-2 text-sm">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{restaurant.address}</span>
                  </div>

                  <div className="mt-auto pt-6">
                    <Button
                      onClick={() => handleSelectRestaurant(restaurant.id)}
                      className="w-full bg-orange-50 text-orange-600 hover:bg-primary hover:text-white font-bold rounded-xl py-2.5 flex items-center justify-center gap-2 transition-colors"
                    >
                      Vào quản lý <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
