import React from 'react';
import { Globe, UtensilsCrossed, Smile } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: Globe,
      title: 'Đặt món qua Website',
      description:
        'Truy cập trực tiếp trên trình duyệt web, tìm kiếm nhanh món ăn ưa thích và địa chỉ giao hàng.',
    },
    {
      icon: UtensilsCrossed,
      title: 'Lựa chọn món ăn',
      description: 'Khám phá thực đơn đa dạng phong phú từ hàng ngàn nhà hàng uy tín hàng đầu.',
    },
    {
      icon: Smile,
      title: 'Thưởng thức món ăn!',
      description:
        'Nhận món ăn nóng hổi được giao tận nơi nhanh chóng và tận hưởng hương vị tuyệt hảo.',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-normal text-center text-slate-900 mb-16 tracking-tight">
          Cách thức hoạt động
        </h2>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-4xl p-8 md:p-10 flex flex-col items-center text-center shadow-sm border border-slate-100/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Icon Container with Figma Organic Pink Blob */}
              <div className="relative w-20 h-20 flex items-center justify-center mb-6">
                <div
                  className="absolute inset-0 bg-rose-100 group-hover:scale-110 transition-transform duration-300 opacity-80"
                  style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
                />
                <step.icon className="relative z-10 w-9 h-9 text-primary" />
              </div>

              {/* Step Title */}
              <h3 className="text-primary font-bold text-lg mb-3 tracking-tight">{step.title}</h3>

              {/* Step Description */}
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
