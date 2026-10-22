import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useRestaurant } from '@/context';
import { OrderColumn } from './merchant';
import { OrderStatus } from '@/constants/orderStatus';
import { orderApi, Order } from '@/services/api/order';
import { useSocket } from '@/hooks/useSocket';
import { TrendingUp, Package, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/utils';

export const MerchantOrderDashboard: React.FC = () => {
  const { selectedRestaurantId } = useRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { onOrderStatusUpdated, onNewOrder } = useSocket();

  useEffect(() => {
    if (selectedRestaurantId) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRestaurantId]);

  useEffect(() => {
    const unsubscribeUpdate = onOrderStatusUpdated((data: unknown) => {
      const updatedOrder = data as Order;
      setOrders((prev) => {
        const exists = prev.find((o) => o.id === updatedOrder.id);
        if (exists) {
          return prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
        }
        return [updatedOrder, ...prev];
      });
    });

    const unsubscribeNew = onNewOrder((data: unknown) => {
      const newOrder = data as Order;
      setOrders((prev) => {
        const exists = prev.find((o) => o.id === newOrder.id);
        if (exists) return prev; // Avoid duplicates
        return [newOrder, ...prev];
      });
    });

    return () => {
      unsubscribeUpdate();
      unsubscribeNew();
    };
  }, [onOrderStatusUpdated, onNewOrder]);

  const fetchOrders = async () => {
    if (!selectedRestaurantId) return;
    try {
      setIsLoading(true);
      // Giả định orderApi.getOrders nhận param { restaurantId }
      const data = await orderApi.getOrders(); // Thực tế cần pass ID: orderApi.getOrders({ restaurantId: selectedRestaurantId })
      // For now, if the API doesn't support filtering by restaurantId, we just fetch all merchant orders.
      // Since it's a monolithic backend mock, we will leave it as is or add filtering.
      setOrders(data);
    } catch (err: unknown) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: OrderStatus) => {
    try {
      // Optimistic update
      setOrders((prev) =>
        prev.map((order) =>
          order.id.toString() === id ? { ...order, statusCode: newStatus } : order
        )
      );

      await orderApi.updateOrderStatus(Number(id), newStatus);
    } catch (err) {
      console.error('Failed to update order status:', err);
      // Revert on error by refetching
      fetchOrders();
    }
  };

  const pendingOrders = orders.filter((o) => o.statusCode === 'PENDING');
  const confirmedOrders = orders.filter(
    (o) =>
      o.statusCode === 'CONFIRMED' ||
      o.statusCode === 'DRIVER_ACCEPTED' ||
      o.statusCode === 'PICKING_UP'
  );
  const deliveringOrders = orders.filter(
    (o) => o.statusCode === 'DELIVERING' || o.statusCode === 'COMPLETED'
  );

  if (!selectedRestaurantId) {
    return <Navigate to="/merchant/restaurants" replace />;
  }

  if (isLoading && orders.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalRevenue = orders
    .filter((o) => o.statusCode === 'COMPLETED' || o.statusCode === 'DELIVERING')
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const activeCount = orders.filter(
    (o) => o.statusCode !== 'COMPLETED' && o.statusCode !== 'CANCELLED'
  ).length;
  const completedCount = orders.filter((o) => o.statusCode === 'COMPLETED').length;

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tổng quan Đơn hàng</h1>
        <p className="text-slate-500 mt-1 font-medium">
          Theo dõi và xử lý đơn hàng theo thời gian thực
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <TrendingUp className="w-7 h-7 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
              Doanh thu hôm nay
            </p>
            <h3 className="text-2xl font-black text-slate-900">{formatCurrency(totalRevenue)}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <Package className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
              Đơn đang xử lý
            </p>
            <h3 className="text-2xl font-black text-slate-900">{activeCount} đơn</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <CheckCircle className="w-7 h-7 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
              Đơn đã hoàn thành
            </p>
            <h3 className="text-2xl font-black text-slate-900">{completedCount} đơn</h3>
          </div>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex h-full gap-6 min-w-max">
          <OrderColumn
            title="Chờ xác nhận"
            count={pendingOrders.length}
            colorClass="bg-amber-400"
            orders={pendingOrders}
            onUpdateStatus={handleUpdateStatus}
          />
          <OrderColumn
            title="Đang chuẩn bị"
            count={confirmedOrders.length}
            colorClass="bg-blue-400"
            orders={confirmedOrders}
            onUpdateStatus={handleUpdateStatus}
          />
          <OrderColumn
            title="Đã giao tài xế"
            count={deliveringOrders.length}
            colorClass="bg-emerald-400"
            orders={deliveringOrders}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </div>
    </div>
  );
};
