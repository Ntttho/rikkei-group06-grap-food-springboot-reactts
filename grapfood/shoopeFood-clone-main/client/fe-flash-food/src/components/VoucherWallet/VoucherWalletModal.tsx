import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, X, Copy, Check, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/utils';
import { toast } from 'sonner';

interface VoucherWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVoucher?: (code: string) => void;
}

interface VoucherItem {
  id: number;
  code: string;
  title: string;
  discountAmount: number;
  minOrderValue: number;
  expiryDate: string;
  badge: string;
}

const AVAILABLE_VOUCHERS: VoucherItem[] = [
  {
    id: 1,
    code: 'GIAM20K',
    title: 'Giảm 20.000đ cho đơn hàng đầu tiên',
    discountAmount: 20000,
    minOrderValue: 60000,
    expiryDate: 'HSD: 31/12/2026',
    badge: 'HOT DEAL',
  },
  {
    id: 2,
    code: 'FREESHIP',
    title: 'Miễn phí vận chuyển toàn sàn',
    discountAmount: 15000,
    minOrderValue: 40000,
    expiryDate: 'HSD: 24/11/2026',
    badge: 'TIẾT KIỆM',
  },
  {
    id: 3,
    code: 'FLASH50K',
    title: 'Giảm 50.000đ cho đơn từ 200k',
    discountAmount: 50000,
    minOrderValue: 200000,
    expiryDate: 'HSD: 15/12/2026',
    badge: 'TIỆC TO',
  },
];

export const VoucherWalletModal: React.FC<VoucherWalletModalProps> = ({
  isOpen,
  onClose,
  onApplyVoucher,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Đã sao chép mã ${code}!`);
    if (onApplyVoucher) {
      onApplyVoucher(code);
    }
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Tag className="h-6 w-6" />
                <div>
                  <h3 className="font-black text-lg">Kho Mã Giảm Giá</h3>
                  <p className="text-xs text-rose-100">Áp dụng ngay khi thanh toán đơn hàng</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="p-5 overflow-y-auto space-y-3.5 bg-slate-50/50 flex-1">
              {AVAILABLE_VOUCHERS.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-rose-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider bg-rose-50 text-rose-600 mb-1.5">
                        {v.badge}
                      </span>
                      <h4 className="font-bold text-sm text-slate-800 leading-snug">{v.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 text-slate-400" />
                        Đơn tối thiểu {formatCurrency(v.minOrderValue)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-rose-600">
                        -{formatCurrency(v.discountAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {v.expiryDate}
                    </span>

                    <button
                      onClick={() => handleCopy(v.code)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs transition-all cursor-pointer ${
                        copiedCode === v.code
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm'
                      }`}
                    >
                      {copiedCode === v.code ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Đã lưu</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Dùng mã {v.code}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
              Mã giảm giá sẽ được tự động tính vào hóa đơn khi bạn nhập mã tại trang Thanh toán.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
