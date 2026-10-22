import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi, Order, OrderStatus } from '@/services/api/order';
import { Navigation, Bike, ChefHat, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context';
import { useSocket } from '@/hooks/useSocket';

const ACTIVE_STATUSES = ['PENDING', 'CONFIRMED', 'DRIVER_ACCEPTED', 'PICKING_UP', 'DELIVERING'];

export const ActiveOrderBanner: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const { joinOrderRoom, leaveOrderRoom, onOrderStatusUpdated } = useSocket();

  // Initial Fetch
  useEffect(() => {
    if (!user || user.role.toLowerCase() !== 'customer') return;

    let isMounted = true;
    const fetchActiveOrder = async () => {
      try {
        const orders = await orderApi.getOrders();
        const active = orders.find((o) => ACTIVE_STATUSES.includes(o.statusCode));
        if (isMounted) setActiveOrder(active || null);
      } catch (err) {
        console.error(err);
      }
    };

    fetchActiveOrder();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Real-time Updates
  useEffect(() => {
    if (!activeOrder?.id) return;

    joinOrderRoom(activeOrder.id);

    const unsubscribe = onOrderStatusUpdated((data: unknown) => {
      const payload = data as { statusCode?: string; statusName?: string };
      if (payload && payload.statusCode) {
        setActiveOrder((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            statusCode: payload.statusCode as OrderStatus,
            statusName: payload.statusName || prev.statusName,
          };
        });

        if (payload.statusCode === 'COMPLETED' || payload.statusCode === 'CANCELLED') {
          setTimeout(() => {
            setActiveOrder(null);
          }, 4000);
        }
      }
    });

    return () => {
      leaveOrderRoom(activeOrder.id);
      if (unsubscribe) unsubscribe();
    };
  }, [activeOrder?.id, joinOrderRoom, leaveOrderRoom, onOrderStatusUpdated]);

  if (!activeOrder) return null;

  let progress = 0;
  let text = '';
  let Icon = Clock;

  switch (activeOrder.statusCode) {
    case 'PENDING':
      progress = 10;
      text = 'Chờ xác nhận';
      Icon = Clock;
      break;
    case 'CONFIRMED':
      progress = 25;
      text = 'Quán đã nhận';
      Icon = ChefHat;
      break;
    case 'DRIVER_ACCEPTED':
      progress = 40;
      text = 'Tài xế đang đến quán';
      Icon = Bike;
      break;
    case 'PICKING_UP':
      progress = 60;
      text = 'Đang lấy món';
      Icon = ChefHat;
      break;
    case 'DELIVERING':
      progress = 85;
      text = 'Đang giao hàng';
      Icon = Bike;
      break;
    case 'COMPLETED':
      progress = 100;
      text = 'Đã giao thành công';
      Icon = CheckCircle;
      break;
    default:
      progress = 10;
      text = 'Đang xử lý';
      Icon = Clock;
      break;
  }

  return (
    <div
      onClick={() => navigate(`/tracking?orderId=${activeOrder.id}`)}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm bg-white rounded-2xl shadow-xl border border-primary/20 p-4 cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary p-2.5 rounded-xl animate-pulse">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Đơn hàng #{activeOrder.orderCode}</h4>
            <p className="text-primary font-bold text-xs mt-0.5">{text}</p>
          </div>
        </div>
        <div className="bg-slate-50 p-2 rounded-full text-slate-400">
          <Navigation className="w-4 h-4" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
