import React from 'react';
import { Clock, Phone, User, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/utils';
import { OrderStatus } from '@/constants/orderStatus';
import { Order } from '@/services/api/order';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (id: string, newStatus: OrderStatus) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdateStatus }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-black text-slate-400">#{order.orderCode}</span>
          <div className="flex items-center gap-1.5 text-slate-800 font-bold mt-0.5">
            <User className="w-4 h-4 text-slate-400" />
            {order.customer?.fullName || 'Khách hàng'}
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
          <Clock className="w-3 h-3" />
          {new Date(order.createdAt).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-4 pb-3 border-b border-slate-100">
        <Phone className="w-3 h-3" />
        {order.customer?.phone || 'Chưa cập nhật'}
      </div>

      <div className="space-y-2 mb-4 max-h-32 overflow-y-auto custom-scrollbar pr-1">
        {order.items?.map((item) => (
          <div key={item.id} className="text-sm">
            <div className="flex justify-between">
              <span className="font-bold text-slate-700">
                <span className="text-primary mr-1">{item.quantity}x</span>
                {item.foodName}
              </span>
              <span className="text-slate-600 font-medium">
                {formatCurrency(item.priceAtOrder * item.quantity)}
              </span>
            </div>
            {order.notes && (
              <p className="text-xs text-amber-600 bg-amber-50 p-1.5 rounded-md mt-1 inline-block">
                Ghi chú: {order.notes}
              </p>
            )}
            {item.toppings && item.toppings.length > 0 && (
              <p className="text-xs text-slate-500 mt-0.5">
                + {item.toppings.map((t) => t.toppingName).join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <span className="text-sm font-bold text-slate-500">Tổng cộng</span>
        <span className="text-lg font-black text-primary">{formatCurrency(order.totalAmount)}</span>
      </div>

      {/* Hành động chuyển trạng thái */}
      <div className="mt-4 flex gap-2">
        {order.statusCode === 'PENDING' && (
          <button
            onClick={() => onUpdateStatus(order.id.toString(), 'CONFIRMED')}
            className="flex-1 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-sm font-bold transition-colors"
          >
            Nhận đơn & Làm món
          </button>
        )}
        {(order.statusCode === 'CONFIRMED' ||
          order.statusCode === 'DRIVER_ACCEPTED' ||
          order.statusCode === 'PICKING_UP') && (
          <div className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold text-center flex items-center justify-center gap-1">
            <CheckCircle className="w-4 h-4" /> Đang chuẩn bị / Đợi tài xế
          </div>
        )}
        {(order.statusCode === 'DELIVERING' || order.statusCode === 'COMPLETED') && (
          <div className="flex-1 py-2 bg-slate-50 text-slate-400 rounded-lg text-sm font-bold text-center flex items-center justify-center gap-1">
            <CheckCircle className="w-4 h-4" /> Đã hoàn thành
          </div>
        )}
      </div>
    </div>
  );
};
