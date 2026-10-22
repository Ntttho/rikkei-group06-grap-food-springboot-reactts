import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components';
import { useCart } from '@/context';
import { formatCurrency } from '@/utils';

type QrStage = 'ready' | 'processing' | 'success';

export const QrPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { totalPrice, clearCart } = useCart();
  const [stage, setStage] = useState<QrStage>('ready');

  // MOCK: Giả sử phí giao hàng 15k
  const finalTotal = totalPrice > 0 ? totalPrice + 15000 : 0;
  const mockOrderId = Math.floor(Math.random() * 100000);

  const handleMockPaid = () => {
    setStage('processing');

    // Giả lập hệ thống nhận được callback từ ngân hàng
    setTimeout(() => {
      setStage('success');

      // Chuyển sang Tracking
      setTimeout(() => {
        clearCart();
        navigate(`/tracking?orderId=${mockOrderId}`);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-primary to-rose-600 p-6 text-center text-white">
          <h1 className="text-2xl font-black mb-2">Thanh toán QR</h1>
          <p className="text-rose-100 font-medium text-sm">
            Quét mã bằng ứng dụng Ngân hàng hoặc Ví điện tử
          </p>
        </div>

        <div className="p-8 flex flex-col items-center text-center">
          {stage === 'ready' && (
            <>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 shadow-sm">
                <div className="w-56 h-56 bg-white rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300 relative overflow-hidden group cursor-pointer hover:border-primary transition-colors">
                  <QrCode className="h-20 w-20 text-slate-300 group-hover:text-primary transition-colors" />
                  <div className="absolute inset-0 bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-primary font-bold">Mã QR Giả Lập</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-slate-500 font-medium mb-1">Số tiền thanh toán</p>
                <p className="text-3xl font-black text-slate-900">{formatCurrency(finalTotal)}</p>
              </div>

              <Button onClick={handleMockPaid} className="w-full h-14 rounded-xl text-[15px]">
                Mock giả đã thanh toán
              </Button>
            </>
          )}

          {stage === 'processing' && (
            <div className="flex flex-col items-center py-12">
              <div className="h-20 w-20 rounded-full border-4 border-slate-100 border-t-primary animate-spin mb-6"></div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Đang chờ thanh toán...</h2>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" /> Vui lòng không đóng trang này
              </p>
            </div>
          )}

          {stage === 'success' && (
            <div className="flex flex-col items-center py-12 animate-fade-in-up">
              <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Thanh toán thành công!</h2>
              <p className="text-slate-500 font-medium">
                Đang chuyển hướng đến Đơn hàng của bạn...
              </p>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={() => navigate('/app/checkout')}
              className="text-sm font-bold text-slate-500 hover:text-primary transition-colors"
              disabled={stage !== 'ready'}
            >
              Hủy và chọn phương thức khác
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
