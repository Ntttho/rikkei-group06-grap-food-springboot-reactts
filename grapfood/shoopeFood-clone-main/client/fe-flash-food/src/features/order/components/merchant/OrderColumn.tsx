import React from 'react';
import { OrderCard } from './OrderCard';
import { OrderStatus } from '@/constants/orderStatus';
import { Order } from '@/services/api/order';

interface OrderColumnProps {
  title: string;
  count: number;
  colorClass: string;
  orders: Order[];
  onUpdateStatus: (id: string, newStatus: OrderStatus) => void;
}

export const OrderColumn: React.FC<OrderColumnProps> = ({
  title,
  count,
  colorClass,
  orders,
  onUpdateStatus,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden shrink-0 w-80 lg:w-96">
      {/* Column Header */}
      <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
          <h3 className="font-bold text-slate-800">{title}</h3>
        </div>
        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-sm font-bold">
          {count}
        </span>
      </div>

      {/* Column Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onUpdateStatus={onUpdateStatus} />
        ))}
        {orders.length === 0 && (
          <div className="text-center p-8 text-sm text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-xl">
            Không có đơn hàng nào
          </div>
        )}
      </div>
    </div>
  );
};
