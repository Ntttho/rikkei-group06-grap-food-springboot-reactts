import React from 'react';
import { ArrowRight, ShoppingBag, Bike, ShieldCheck } from 'lucide-react';

export const AppFeaturesSection: React.FC = () => {
  const features = [
    {
      id: 1,
      title: 'Đặt Món Dễ Dàng',
      desc: 'Quy trình đặt món trực quan, tìm kiếm nhanh chóng và thao tác chọn món tiện lợi trên website.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
      icon: ShoppingBag,
      highlight: false,
    },
    {
      id: 2,
      title: 'Giao Hàng Siêu Tốc',
      desc: 'Đội ngũ tài xế đông đảo phủ khắp các khu vực, đảm bảo món ăn được giao đến luôn nóng hổi.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
      icon: Bike,
      highlight: true,
    },
    {
      id: 3,
      title: 'Thanh Toán An Toàn',
      desc: 'Hỗ trợ đa dạng phương thức thanh toán linh hoạt, bảo mật tuyệt đối mọi thông tin giao dịch.',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
      icon: ShieldCheck,
      highlight: false,
    },
  ];

  return (
    <section className="px-4 md:px-8 py-8">
      {/* Section Title */}
      <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Tính Năng Nổi Bật
        </h2>
        <p className="text-slate-500 text-xs md:text-sm">
          Những giá trị cốt lõi mang lại trải nghiệm đặt món trọn vẹn nhất cho bạn.
        </p>
      </div>

      {/* 3 Foodland Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        {features.map((item) => {
          const Icon = item.icon;
          const isHighlighted = item.highlight;

          return (
            <div
              key={item.id}
              className={`relative rounded-3xl p-7 pt-16 text-center transition-all duration-300 group ${
                isHighlighted
                  ? 'bg-primary text-white shadow-lg shadow-rose-500/20 -translate-y-1'
                  : 'bg-white text-slate-900 border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-md'
              }`}
            >
              {/* Circular Food Photo Floating On Top */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 md:w-28 md:h-28 rounded-full p-1.5 bg-white shadow-md">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 p-1.5 rounded-full shadow-sm ${
                      isHighlighted ? 'bg-white text-primary' : 'bg-primary text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <h3
                className={`text-lg font-black mb-2 ${
                  isHighlighted ? 'text-white' : 'text-slate-900'
                }`}
              >
                {item.title}
              </h3>

              <p
                className={`text-xs md:text-sm leading-relaxed mb-5 ${
                  isHighlighted ? 'text-rose-100' : 'text-slate-500'
                }`}
              >
                {item.desc}
              </p>

              <button
                className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all group-hover:gap-2 ${
                  isHighlighted ? 'text-white' : 'text-primary'
                }`}
              >
                Khám phá thêm <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
