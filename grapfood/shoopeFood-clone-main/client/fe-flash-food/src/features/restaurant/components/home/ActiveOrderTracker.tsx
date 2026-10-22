import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

export const ActiveOrderTracker: React.FC = () => {
  const navigate = useNavigate();

  // MOCK: Later we will fetch active orders from API or Socket
  const hasActiveOrder = false; // Change to true to test UI

  if (!hasActiveOrder) return null;

  return (
    <section className="px-4 md:px-8 pt-2 pb-6 max-w-[1400px] mx-auto">
      <div
        onClick={() => navigate('/tracking')}
        className="bg-white rounded-2xl p-4 md:p-5 flex items-center justify-between border border-emerald-100 shadow-md hover:shadow-lg transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <MapPin className="h-6 w-6 text-emerald-600 animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Đơn hàng đang giao đến bạn</h3>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Dự kiến: 15 phút
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                Đang giao
              </span>
            </div>
          </div>
        </div>
        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-slate-400">
          <ArrowRight className="h-5 w-5" />
        </div>
      </div>
    </section>
  );
};
