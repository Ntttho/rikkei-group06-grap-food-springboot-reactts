import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FlashSaleBanner: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 text-white p-6 md:p-8 shadow-xl my-8">
      {/* Background Glow & Shapes */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Info */}
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-black tracking-wider uppercase">
            <Flame className="h-4 w-4 animate-bounce text-amber-300" />
            Giờ Vàng Giá Sốc • Flash Sale
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Ưu Đãi Lên Đến <span className="text-amber-300">50%</span> Hôm Nay
          </h2>
          <p className="text-rose-100 text-sm max-w-md font-medium">
            Hàng trăm món ngon từ các quán đối tác 5 sao đang mở bán giá đặc biệt. Số lượng có hạn!
          </p>
        </div>

        {/* Right Timer & CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Countdown Clock */}
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-300" />
            <div className="flex items-center gap-1.5 text-slate-900 font-mono font-black text-sm">
              <span className="bg-white px-2.5 py-1.5 rounded-xl shadow-md">{formatNumber(timeLeft.hours)}</span>
              <span className="text-white text-base">:</span>
              <span className="bg-white px-2.5 py-1.5 rounded-xl shadow-md">{formatNumber(timeLeft.minutes)}</span>
              <span className="text-white text-base">:</span>
              <span className="bg-white px-2.5 py-1.5 rounded-xl shadow-md text-rose-600">{formatNumber(timeLeft.seconds)}</span>
            </div>
          </div>

          <Link
            to="/app/restaurants"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm shadow-lg hover:shadow-amber-400/40 transition-all hover:scale-105 active:scale-95"
          >
            <span>Khám Phá Ngay</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
