import React from 'react';
import { Clock, ShieldCheck, Map } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Clock,
      title: 'Giao hàng siêu tốc',
      description:
        'Nhận thức ăn nóng hổi chỉ trong vòng chưa đầy 30 phút. Nhanh chóng và đáng tin cậy.',
    },
    {
      icon: ShieldCheck,
      title: 'Chất lượng đảm bảo',
      description: 'Hợp tác với các nhà hàng uy tín hàng đầu, đảm bảo vệ sinh an toàn thực phẩm.',
    },
    {
      icon: Map,
      title: 'Theo dõi trực tiếp',
      description:
        'Theo dõi đơn hàng của bạn theo thời gian thực trên bản đồ từ khi đặt đến khi nhận.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-primary font-bold text-lg mb-2 tracking-wide uppercase">
            Vì sao chọn chúng tôi
          </h2>
          <h3 className="text-4xl font-black text-slate-900 leading-tight">
            Phục vụ bạn với những tiêu chuẩn khắt khe nhất
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group p-8 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
            >
              <div className="h-20 w-20 bg-rose-50 text-primary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feat.icon className="h-10 w-10" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-4">{feat.title}</h4>
              <p className="text-slate-500 font-medium leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
