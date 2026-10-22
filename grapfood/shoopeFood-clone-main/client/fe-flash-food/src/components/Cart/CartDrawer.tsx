import React, { useEffect } from 'react';
import { useCart } from '@/context';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white/95 backdrop-blur-md shadow-2xl z-50 flex flex-col animate-slide-in-right border-l border-slate-100">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white/50">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Giỏ Hàng
            </h2>
            {items.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
                    clearCart();
                  }
                }}
                className="text-xs font-bold text-slate-400 hover:text-primary transition-colors bg-slate-100 hover:bg-red-50 px-2 py-1 rounded-md"
              >
                Xóa tất cả
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p className="font-medium">Giỏ hàng đang trống</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => {
                const toppingsPrice = item.toppings.reduce((sum, t) => sum + Number(t.price), 0);
                const itemTotal = (Number(item.price) + toppingsPrice) * item.quantity;

                return (
                  <div
                    key={`${item.foodId}-${item.toppings.map((t) => t.id).join('-')}`}
                    className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100/50 shadow-sm"
                  >
                    {item.imageUrl && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col relative">
                      <div className="flex justify-between items-start gap-2 pr-6">
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.foodId, item.toppings)}
                          className="absolute right-0 top-0 text-slate-400 hover:text-primary transition-colors p-1 -mr-1 -mt-1"
                          title="Xóa món này"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {item.toppings.length > 0 && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                          {item.toppings.map((t) => t.name).join(', ')}
                        </p>
                      )}

                      <div className="mt-auto pt-2 flex items-center justify-between">
                        <span className="font-black text-primary text-sm">
                          {formatCurrency(itemTotal)}
                        </span>

                        <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                          <button
                            onClick={() =>
                              updateQuantity(item.foodId, item.toppings, item.quantity - 1)
                            }
                            className="p-1 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.foodId, item.toppings, item.quantity + 1)
                            }
                            className="p-1 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-white/80 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-600 font-bold">Tổng thanh toán ({totalItems} món):</span>
              <span className="text-xl font-black text-slate-900">
                {formatCurrency(totalPrice)}
              </span>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  onClose();
                  navigate('/app/checkout');
                }}
                className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-black rounded-xl shadow-[0_4px_20px_rgba(225,29,72,0.3)] hover:shadow-[0_6px_25px_rgba(225,29,72,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Tiến Hành Thanh Toán
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Tiếp tục mua hàng
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
