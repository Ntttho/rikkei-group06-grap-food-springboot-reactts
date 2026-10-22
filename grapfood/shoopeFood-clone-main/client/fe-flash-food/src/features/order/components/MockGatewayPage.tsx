import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '@/context';
import { CheckCircle, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils';

export const MockGatewayPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { totalPrice, clearCart } = useCart();
  const [isPaid, setIsPaid] = useState(false);

  // MOCK: Phí giao hàng 15k
  const finalTotal = totalPrice > 0 ? totalPrice + 15000 : 0;

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsPaid(true);
    }, 2500); // 2.5s giả lập xử lý

    const timer2 = setTimeout(() => {
      clearCart();
      navigate(`/tracking?orderId=${id}`);
    }, 4500); // 4.5s tự động chuyển về app

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [id, navigate, clearCart]);

  return (
    <div className="min-h-screen bg-[#0068FF] flex items-center justify-center p-4">
      {/* Giả lập giao diện ZaloPay */}
      <div className="bg-white max-w-sm w-full rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="p-6 text-center border-b border-slate-100">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 font-black text-2xl">
            ZP
          </div>
          <h1 className="text-xl font-bold text-slate-800">Cổng thanh toán ZaloPay</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Đơn hàng #{id}</p>
        </div>

        <div className="p-8 text-center">
          {!isPaid ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
              <p className="font-bold text-slate-700 text-lg mb-1">Đang xử lý giao dịch</p>
              <p className="text-3xl font-black text-slate-900">{formatCurrency(finalTotal)}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-fade-in-up">
              <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
              <p className="font-bold text-emerald-600 text-lg mb-1">Thanh toán thành công</p>
              <p className="text-slate-500 font-medium text-sm">Đang quay lại FlashFood...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
