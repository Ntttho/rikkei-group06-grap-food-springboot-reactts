import React from 'react';
import { Zap, ShieldCheck, Headphones, ArrowRight } from 'lucide-react';

export const HomeStats: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Giao Hàng Siêu Tốc',
      desc: 'Đảm bảo giao món nóng hổi trong vòng 20 phút với đội ngũ tài xế đông đảo.',
      bg: 'bg-rose-50 border-rose-100 text-primary',
    },
    {
      icon: ShieldCheck,
      title: 'Chất Lượng Đảm Bảo',
      desc: '100% quán ăn được kiểm duyệt vệ sinh an toàn thực phẩm nghiêm ngặt.',
      bg: 'bg-amber-50 border-amber-100 text-amber-600',
    },
    {
      icon: Headphones,
      title: 'Hỗ Trợ 24/7',
      desc: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào.',
      bg: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    },
  ];

  return (
    <section className="px-4 md:px-8 space-y-10">
      {/* Stats Counter Bar (Inspired by Foodland) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <h4 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            800<span className="text-primary">+</span>
          </h4>
          <p className="text-xs md:text-sm font-bold text-slate-500 mt-1">Quán Ngon Đối Tác</p>
        </div>
        <div>
          <h4 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            80k<span className="text-primary">+</span>
          </h4>
          <p className="text-xs md:text-sm font-bold text-slate-500 mt-1">
            Đơn Hàng Giao Mỗi Tháng
          </p>
        </div>
        <div>
          <h4 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            99<span className="text-primary">%</span>
          </h4>
          <p className="text-xs md:text-sm font-bold text-slate-500 mt-1">Khách Hàng Hài Lòng</p>
        </div>
        <div>
          <h4 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            15<span className="text-primary">phút</span>
          </h4>
          <p className="text-xs md:text-sm font-bold text-slate-500 mt-1">
            Thời Gian Giao Trung Bình
          </p>
        </div>
      </div>

      {/* Feature Cards (Inspired by Foodland) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col items-start"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${item.bg} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">{item.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">{item.desc}</p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all mt-auto cursor-pointer">
                Khám phá thêm <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
