import React from 'react';
import { ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="px-4 md:px-8 py-6 md:py-10 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Content */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-0.5 bg-primary" />
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Chào Mừng Đến Với FlashFood!
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight">
            Dịch vụ giao đồ ăn siêu tốc hàng đầu của bạn
          </h1>

          <p className="text-slate-500 text-sm md:text-base max-w-xl leading-relaxed">
            FlashFood mang đến trải nghiệm đặt món ăn nhanh chóng, tiện lợi cùng thực đơn phong phú
            từ hàng nghìn nhà hàng chất lượng hàng đầu.
          </p>

          <div className="pt-1">
            <button className="inline-flex items-center gap-2 bg-primary hover:bg-rose-700 text-white font-bold px-7 py-3.5 rounded-full shadow-md shadow-rose-500/20 hover:shadow-rose-500/40 hover:-translate-y-0.5 transition-all active:scale-95 text-sm">
              Khám Phá Món Ngon <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="pt-5 border-t border-slate-100 flex items-center gap-10">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900">
                800<span className="text-primary">+</span>
              </h3>
              <p className="text-xs font-bold text-slate-500 mt-0.5">Khách Hàng Hài Lòng</p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900">
                80k<span className="text-primary">+</span>
              </h3>
              <p className="text-xs font-bold text-slate-500 mt-0.5">Đơn Hàng Thành Công</p>
            </div>
          </div>
        </div>

        {/* Right Circular Hero Image */}
        <div className="lg:col-span-5 flex justify-center relative">
          <div className="relative w-65 h-65 sm:w-80 sm:h-80 md:w-95 md:h-95 rounded-full bg-slate-50 p-3 shadow-lg border-4 border-white overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&q=80"
              alt="Giao Đồ Ăn Nhanh Chóng"
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="absolute inset-0 rounded-full bg-primary/5 blur-2xl -z-10 transform scale-105" />
        </div>
      </div>
    </section>
  );
};
