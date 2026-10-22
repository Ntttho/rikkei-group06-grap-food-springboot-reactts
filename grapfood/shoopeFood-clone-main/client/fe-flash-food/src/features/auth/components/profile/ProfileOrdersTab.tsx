import React, { useEffect, useState } from 'react';
import { Clock, Navigation, Star, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils';
import { orderApi, Order } from '@/services/api/order';
import { OrderReviewModal } from '@/components/Review/OrderReviewModal';
import { toast } from 'sonner';

export const ProfileOrdersTab: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderApi.getOrders();
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Đang tải lịch sử đơn hàng...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="text-4xl mb-4">🛒</div>
        <h3 className="text-xl font-bold text-slate-800">Bạn chưa có đơn hàng nào</h3>
        <p className="text-slate-500 mt-2 text-sm">Hãy đặt món ngay để lấp đầy bụng đói nhé!</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
        >
          Khám phá món ngon
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Lịch sử đặt hàng</h3>

      {orders.map((order) => {
        const isCompleted = order.statusCode === 'COMPLETED';
        const isCancelled = order.statusCode === 'CANCELLED';
        const isPending = !isCompleted && !isCancelled;
        const dateStr = new Date(order.createdAt).toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div
            key={order.id}
            className={`bg-white rounded-3xl p-5 md:p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 md:items-center relative overflow-hidden ${isPending ? 'ring-2 ring-primary/20' : ''}`}
          >
            {isPending && (
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-10">
                Đang giao
              </div>
            )}
            <div className="flex-1 z-0">
              <div className="flex flex-wrap items-center gap-2 mb-2 pr-20">
                <span className="font-bold text-slate-900">
                  {order.restaurantId ? `Nhà hàng #${order.restaurantId}` : 'Nhà hàng'}
                </span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-sm text-slate-500">#{order.orderCode}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                <Clock className="w-3.5 h-3.5" />
                {dateStr}
              </div>
              <p className="text-sm text-slate-600 line-clamp-1 mb-2">
                Trạng thái:{' '}
                <span className="font-semibold text-slate-800">
                  {order.statusName || order.statusCode}
                </span>
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-end gap-2 md:pl-4 md:border-l border-slate-100 relative z-10">
              <div className="text-lg font-black text-slate-900">
                {formatCurrency(order.totalAmount)}
              </div>

              {isCompleted && (
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-2">
                  <button
                    onClick={() => setReviewOrder(order)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-amber-200"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    Đánh giá
                  </button>

                  <button
                    onClick={() => {
                      toast.info('Đang chuyển tới quán để đặt lại...');
                      navigate(`/app/restaurants/${order.restaurantId || 1}`);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Đặt lại
                  </button>
                </div>
              )}

              {isPending && (
                <button
                  onClick={() => navigate(`/tracking?orderId=${order.id}`)}
                  className="mt-2 flex items-center justify-center gap-2 w-full md:w-auto px-5 py-2.5 bg-primary text-white hover:bg-primary-dark transition-colors rounded-xl text-sm font-bold shadow-sm cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  Theo dõi đơn
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Review Modal */}
      {reviewOrder && (
        <OrderReviewModal
          isOpen={!!reviewOrder}
          onClose={() => setReviewOrder(null)}
          orderId={reviewOrder.id}
          restaurantId={reviewOrder.restaurantId || 1}
          driverId={reviewOrder.driverId || undefined}
          onSuccess={() => toast.success('Đã ghi nhận đánh giá của bạn!')}
        />
      )}
    </div>
  );
};
