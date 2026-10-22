import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context';
import { useSocket } from '@/hooks/useSocket';
import { orderApi, Order } from '@/services/api/order';
import { driverApi } from '@/features/driver/services/driverApi';
import { Button } from '@/components';
import { formatCurrency } from '@/utils';
import { Power, MapPin, Navigation, Bike, CheckCircle, Clock, Wallet, Star, Award, TrendingUp } from 'lucide-react';

export const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const { onDriverOrderOffered, joinDriverRoom, isConnected } = useSocket();
  const [activeTab, setActiveTab] = useState<'deliveries' | 'wallet' | 'reviews'>('deliveries');
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [isAcceptingId, setIsAcceptingId] = useState<number | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const [isOnline, setIsOnline] = useState(false);

  // Tham gia phòng Socket và cập nhật tọa độ ảo khi Driver online
  useEffect(() => {
    if (user && isConnected && isOnline) {
      joinDriverRoom(user.id);

      // Fetch active orders to avoid getting blocked by existing ghost orders
      driverApi
        .getMyOrders()
        .then((data) => {
          if (data.active && data.active.length > 0) {
            setCurrentOrder(data.active[0]);
          }
          if (data.available && data.available.length > 0) {
            setAvailableOrders(data.available);
          }
        })
        .catch(console.error);

      const sendLocation = () => {
        driverApi
          .updateLocation(Number(user.id), {
            latitude: 10.762622, // Tọa độ giả định
            longitude: 106.660172,
          })
          .catch(console.error);
      };

      sendLocation(); // Gửi lần đầu
      const locationInterval = setInterval(sendLocation, 60000); // Gửi mỗi 60s

      return () => clearInterval(locationInterval);
    }
    return undefined;
  }, [user, isConnected, joinDriverRoom, isOnline]);

  useEffect(() => {
    const unsubscribe = onDriverOrderOffered((data: unknown) => {
      const typedData = data as { order?: Order } | Order;
      const newOrder =
        'order' in typedData && typedData.order ? typedData.order : (typedData as Order);
      setAvailableOrders((prev) => {
        if (prev.find((o) => o.id === newOrder.id)) return prev;
        return [newOrder, ...prev];
      });
    });
    return () => unsubscribe();
  }, [onDriverOrderOffered]);

  const handleAcceptOrder = async (orderId: number) => {
    setIsAcceptingId(orderId);
    try {
      const order = await orderApi.acceptDriverOrder(orderId);
      setCurrentOrder(order);
      setAvailableOrders([]); // Clear others when busy
    } catch (err) {
      console.error('Failed to accept order:', err);
      alert('Lỗi nhận chuyến. Có thể tài xế khác đã nhận!');
      setAvailableOrders((prev) => prev.filter((o) => o.id !== orderId));
    } finally {
      setIsAcceptingId(null);
    }
  };

  const handleRejectOrder = async (orderId: number) => {
    try {
      await orderApi.rejectDriverOrder(orderId);
    } catch (err) {
      console.error(err);
    } finally {
      setAvailableOrders((prev) => prev.filter((o) => o.id !== orderId));
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col relative pb-6 shadow-2xl overflow-hidden border-x border-slate-200">
      {/* Driver Map Background Mock */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-slate-200 overflow-hidden z-0">
        <div className="absolute inset-0 bg-[url('https://camo.githubusercontent.com/9746fb9ca47b4d3701239ce36098d5c808f9024f8d6de48a43f8e58c7f3e82d8/68747470733a2f2f692e696d6775722e636f6d2f336a5839566d512e706e67')] bg-cover bg-center opacity-40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50" />
      </div>

      {/* Header & Status Toggle */}
      <div className="relative z-10 p-6 pt-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 drop-shadow-sm">
              Chào {user?.fullName || 'Tài xế'}!
            </h1>
            <p className="text-sm font-medium text-slate-600">
              {currentOrder
                ? 'Đang thực hiện đơn hàng'
                : isOnline
                  ? 'Đang tìm kiếm cuốc xe...'
                  : 'Bạn đang ngoại tuyến'}
            </p>
          </div>

          {!currentOrder && (
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${
                isOnline
                  ? 'bg-emerald-500 shadow-emerald-500/40 text-white'
                  : 'bg-white shadow-slate-200/50 text-slate-400 border border-slate-200'
              }`}
            >
              {isOnline && (
                <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400 opacity-40"></span>
              )}
              <Power className={`w-8 h-8 ${isOnline ? 'animate-pulse' : ''}`} />
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        {!currentOrder && (
          <div className="flex bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-slate-200/80 mb-6">
            <button
              onClick={() => setActiveTab('deliveries')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'deliveries'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Chuyến xe</span>
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'wallet'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Ví thu nhập</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Đánh giá</span>
            </button>
          </div>
        )}

        {/* Wallet View */}
        {activeTab === 'wallet' && !currentOrder && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl shadow-emerald-600/20">
              <span className="text-xs font-medium text-emerald-100 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Tổng thu nhập hôm nay
              </span>
              <div className="text-3xl font-black mt-2">345,000 đ</div>
              <div className="mt-4 pt-4 border-t border-white/15 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-emerald-200 block">Cuốc hoàn tất</span>
                  <span className="font-bold text-sm text-white">14 chuyến</span>
                </div>
                <div>
                  <span className="text-emerald-200 block">Tiền tip thêm</span>
                  <span className="font-bold text-sm text-white">45,000 đ</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <h4 className="font-bold text-sm text-slate-800">Lịch sử chuyến xe gần nhất</h4>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">#ORD-9021 • Cơm Tấm Sài Gòn</span>
                    <span className="text-slate-400 text-[10px]">144 Xuân Thủy, Cầu Giấy • 12:45</span>
                  </div>
                  <span className="font-black text-emerald-600 text-sm">+25,000 đ</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">#ORD-9018 • Trà Sữa Koi Thé</span>
                    <span className="text-slate-400 text-[10px]">12 Cầu Giấy • 11:20</span>
                  </div>
                  <span className="font-black text-emerald-600 text-sm">+20,000 đ</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">#ORD-8995 • Gà Rán KFC</span>
                    <span className="text-slate-400 text-[10px]">BigC Thăng Long • 10:15</span>
                  </div>
                  <span className="font-black text-emerald-600 text-sm">+30,000 đ</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews View */}
        {activeTab === 'reviews' && !currentOrder && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Award className="w-8 h-8" />
              </div>
              <div className="text-3xl font-black text-slate-900">4.9 / 5.0</div>
              <div className="flex items-center justify-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs font-bold text-emerald-600">Hạng Tài xế Xuất Sắc</p>
              <p className="text-[11px] text-slate-400 mt-1">Dựa trên 148 lượt đánh giá khách hàng</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <h4 className="font-bold text-sm text-slate-800">Nhận xét từ khách hàng</h4>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Nguyễn Văn An</span>
                    <div className="flex text-amber-400 text-xs">★★★★★</div>
                  </div>
                  <p className="text-slate-600">"Giao hàng siêu nhanh, đồ ăn còn nóng hổi! Rất cảm ơn tài xế."</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Trần Thị Mai</span>
                    <div className="flex text-amber-400 text-xs">★★★★★</div>
                  </div>
                  <p className="text-slate-600">"Tài xế rất lịch sự và gọi trước khi đến."</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State Management Content (Deliveries Tab) */}
        {activeTab === 'deliveries' && !isOnline && !currentOrder ? (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center mt-12">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bike className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Đã sẵn sàng?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Bật trực tuyến để bắt đầu nhận các chuyến giao hàng mới và kiếm thêm thu nhập!
            </p>
            <Button
              onClick={() => setIsOnline(true)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/30"
            >
              Bật Trực Tuyến
            </Button>
          </div>
        ) : currentOrder ? (
          <div className="bg-white p-5 rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-100">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
              <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-full">
                <Bike className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Đơn #{currentOrder.orderCode}</h3>
                <p className="text-sm font-bold text-emerald-600">
                  {formatCurrency(currentOrder.shippingFee)}
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6 relative">
              <div className="absolute top-4 left-[11px] bottom-4 w-0.5 bg-slate-200" />

              <div className="flex gap-3 relative z-10">
                <div className="w-6 h-6 rounded-full bg-white border-4 border-emerald-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Điểm lấy món</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5 leading-tight">
                    {currentOrder.restaurant?.name || 'Quán ăn'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 relative z-10">
                <div className="w-6 h-6 rounded-full bg-white border-4 border-rose-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Điểm giao</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5 leading-tight">
                    {currentOrder.receiverAddress}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {currentOrder.statusCode === 'DRIVER_ACCEPTED' && (
                <Button
                  onClick={async () => {
                    try {
                      const updated = await orderApi.updateOrderStatus(
                        currentOrder.id,
                        'PICKING_UP'
                      );
                      setCurrentOrder(updated);
                    } catch (err) {
                      console.error(err);
                      alert('Lỗi khi cập nhật trạng thái!');
                    }
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 font-bold rounded-xl shadow-md"
                >
                  Đã tới quán & Đang lấy món
                </Button>
              )}

              {currentOrder.statusCode === 'PICKING_UP' && (
                <Button
                  onClick={async () => {
                    try {
                      const updated = await orderApi.updateOrderStatus(
                        currentOrder.id,
                        'DELIVERING'
                      );
                      setCurrentOrder(updated);
                    } catch (err) {
                      console.error(err);
                      alert('Lỗi khi cập nhật trạng thái!');
                    }
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3.5 font-bold rounded-xl shadow-md"
                >
                  Đã lấy xong & Bắt đầu giao
                </Button>
              )}

              {currentOrder.statusCode === 'DELIVERING' && (
                <Button
                  onClick={async () => {
                    try {
                      await orderApi.updateOrderStatus(currentOrder.id, 'COMPLETED');
                      setCurrentOrder(null);
                    } catch (err) {
                      console.error(err);
                      alert('Lỗi khi hoàn thành đơn!');
                    }
                  }}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" /> Đã giao thành công
                </Button>
              )}
            </div>
          </div>
        ) : activeTab === 'deliveries' && availableOrders.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                Đơn mới ({availableOrders.length})
              </h3>
            </div>

            {availableOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transform transition-all active:scale-95"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-black text-xl text-slate-900 leading-tight pr-4">
                      {order.restaurant?.name || 'Nhà hàng'}
                    </h4>
                    <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl font-black text-sm shrink-0 whitespace-nowrap border border-emerald-100">
                      {formatCurrency(order.shippingFee)}
                    </div>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div className="flex gap-2.5 items-start">
                      <Navigation className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-400">KHOẢNG CÁCH</p>
                        <p className="text-sm font-bold text-slate-800">
                          {order.distanceKm || '3.5'} km
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-400">GIAO ĐẾN</p>
                        <p className="text-sm font-bold text-slate-800 line-clamp-2">
                          {order.receiverAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors disabled:opacity-50"
                      onClick={() => handleRejectOrder(order.id)}
                      disabled={isAcceptingId === order.id}
                    >
                      Bỏ qua
                    </button>
                    <button
                      className="flex-[2] py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                      onClick={() => handleAcceptOrder(order.id)}
                      disabled={isAcceptingId !== null}
                    >
                      {isAcceptingId === order.id ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'NHẬN ĐƠN NGAY'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'deliveries' ? (
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-white text-center mt-12 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div
                className="w-[300px] h-[300px] border border-emerald-500 rounded-full animate-ping"
                style={{ animationDuration: '3s' }}
              />
              <div
                className="absolute w-[200px] h-[200px] border border-emerald-500 rounded-full animate-ping"
                style={{ animationDuration: '3s', animationDelay: '1s' }}
              />
              <div
                className="absolute w-[100px] h-[100px] border border-emerald-500 rounded-full animate-ping"
                style={{ animationDuration: '3s', animationDelay: '2s' }}
              />
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Đang dò tìm đơn hàng...</h3>
              <p className="text-sm font-medium text-slate-500">
                Khu vực có nhu cầu cao: Quận 1, Quận 3
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
