import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth, useRestaurant } from '@/context';
import { orderApi, Order } from '@/services/api/order';
import { restaurantApi } from '@/features/restaurant/services/restaurantApi';
import { Restaurant } from '@/types';
import { formatCurrency } from '@/utils';
import {
  ShoppingBag,
  UtensilsCrossed,
  Settings,
  Store,
  TrendingUp,
  Package,
  Star,
} from 'lucide-react';

export const MerchantDashboard: React.FC = () => {
  const { user } = useAuth();
  const { selectedRestaurantId } = useRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedRestaurantId) return;
      try {
        setIsLoading(true);
        const [ordersData, resData] = await Promise.all([
          orderApi.getOrders(), // Giả sử API tự filter theo token/merchant
          restaurantApi.getRestaurantById(selectedRestaurantId),
        ]);
        setOrders(ordersData);
        setRestaurant(resData.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedRestaurantId]);

  if (!selectedRestaurantId) {
    return <Navigate to="/merchant/restaurants" replace />;
  }

  const activeOrders = orders.filter(
    (o) => o.statusCode !== 'COMPLETED' && o.statusCode !== 'CANCELLED'
  );

  const totalRevenue = orders
    .filter((o) => o.statusCode === 'COMPLETED' || o.statusCode === 'DELIVERING')
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black">
            Chào mừng, {user?.fullName || user?.name || 'Chủ quán'}!
          </h1>
          <p className="mt-2 text-orange-100 font-medium text-lg">
            {restaurant ? `Bảng điều khiển quán: ${restaurant.name}` : 'Đang tải dữ liệu quán...'}
          </p>
        </div>
        <Store className="absolute -bottom-8 -right-8 w-48 h-48 opacity-10" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:scale-105">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                <Package className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Đơn đang xử lý
                </span>
                <p className="text-3xl font-black text-slate-900 mt-1">{activeOrders.length}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:scale-105">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                <TrendingUp className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Doanh thu hôm nay
                </span>
                <p className="text-3xl font-black text-emerald-600 mt-1">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:scale-105">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <Star className="w-8 h-8 text-blue-500 fill-current" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Đánh giá trung bình
                </span>
                <p className="text-3xl font-black text-slate-900 mt-1">
                  {restaurant?.ratingAvg || '5.0'}{' '}
                  <span className="text-xl text-slate-400 font-medium">/ 5</span>
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-black text-slate-800 pt-4">Lối tắt truy cập</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              to="/merchant/orders"
              className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Quản lý Đơn hàng</h3>
                <p className="text-sm text-slate-500 mt-1">Xử lý các đơn hàng đang chờ</p>
              </div>
            </Link>

            <Link
              to="/merchant/menu"
              className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:orange-200 transition-all flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Cập nhật Thực đơn</h3>
                <p className="text-sm text-slate-500 mt-1">Thêm món mới, điều chỉnh giá</p>
              </div>
            </Link>

            <Link
              to="/merchant/store"
              className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:orange-200 transition-all flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Thiết lập Quán</h3>
                <p className="text-sm text-slate-500 mt-1">Sửa tên, địa chỉ, giờ mở cửa</p>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};
