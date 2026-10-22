import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Store, Bike } from 'lucide-react';

export const PartnerPromos: React.FC = () => {
  return (
    <section className="px-4 md:px-8 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Merchant Banner */}
        <div className="relative overflow-hidden rounded-[2rem] bg-amber-50 border border-amber-100 p-8 md:p-10 flex items-center group cursor-pointer hover:shadow-lg transition-all">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80')] bg-cover bg-center mask-image-gradient" />
          <div className="relative z-10 max-w-[200px] md:max-w-[250px]">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 text-amber-500 group-hover:scale-110 transition-transform">
              <Store className="w-6 h-6" />
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-2">Trở thành Đối tác Quán</h4>
            <p className="text-sm font-medium text-slate-600 mb-6">
              Mở rộng kinh doanh, tiếp cận hàng triệu khách hàng mới.
            </p>
            <Link
              to="/merchant/login"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-colors"
            >
              Đăng ký ngay <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Driver Banner */}
        <div className="relative overflow-hidden rounded-[2rem] bg-emerald-50 border border-emerald-100 p-8 md:p-10 flex items-center group cursor-pointer hover:shadow-lg transition-all">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[url('https://images.unsplash.com/photo-1590633854832-6a3f9152b1ba?w=400&q=80')] bg-cover bg-center mask-image-gradient" />
          <div className="relative z-10 max-w-[200px] md:max-w-[250px]">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 text-emerald-500 group-hover:scale-110 transition-transform">
              <Bike className="w-6 h-6" />
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-2">Chạy cùng FlashFood</h4>
            <p className="text-sm font-medium text-slate-600 mb-6">
              Tự do thời gian, gia tăng thu nhập mỗi ngày dễ dàng.
            </p>
            <Link
              to="/driver/login"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-colors"
            >
              Đăng ký chạy <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
