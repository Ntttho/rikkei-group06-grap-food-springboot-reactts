import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, ArrowRight } from 'lucide-react';

export const PopularFoodsSection: React.FC = () => {
  const cards = [
    {
      img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
      name: 'Bếp Của Mẹ - Cơm Nhà',
      fee: '15.000đ Phí giao hàng',
      time: '15 - 20 phút',
    },
    {
      img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
      name: 'Nhà Hàng Steakhouse & Wine',
      fee: '20.000đ Phí giao hàng',
      time: '20 - 25 phút',
    },
    {
      img: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop',
      name: 'Bếp Trưởng Hải Sản',
      fee: '10.000đ Phí giao hàng',
      time: '10 - 15 phút',
    },
    {
      img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
      name: 'Quán Ăn Gia Đình Tịnh Tâm',
      fee: 'Miễn phí giao hàng',
      time: '10 - 20 phút',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header Title & View All Link */}
        <div className="flex flex-row justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Phổ biến tại khu vực của bạn
          </h2>
          <Link
            to="/app"
            className="group text-base font-bold text-slate-900 hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Asymmetric Grid layout matching Figma */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Large Card */}
          <div className="md:col-span-1 flex flex-col group cursor-pointer">
            <div className="w-full h-90 md:h-135 rounded-4xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-xl transition-all duration-300">
              <img
                src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800&auto=format&fit=crop"
                alt="Khách sạn 5 sao"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="pt-3.5 px-1">
              <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-primary transition-colors mb-1.5">
                Nhà Hàng Đẳng Cấp 5 Sao
              </h3>
              <div className="flex items-center gap-4 text-xs md:text-sm text-slate-500 font-medium">
                <div className="flex items-center">
                  <ShoppingBag className="w-4 h-4 mr-1 text-slate-400" />
                  <span>25.000đ Phí giao hàng</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-slate-400" />
                  <span>30 - 45 phút</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 2x2 Grid Cards */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
            {cards.map((card, idx) => (
              <div key={idx} className="flex flex-col group cursor-pointer">
                <div className="w-full h-50 md:h-55 rounded-4xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-xl transition-all duration-300">
                  <img
                    src={card.img}
                    alt={card.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="pt-3.5 px-1">
                  <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-primary transition-colors mb-1.5">
                    {card.name}
                  </h3>
                  <div className="flex items-center gap-4 text-xs md:text-sm text-slate-500 font-medium">
                    <div className="flex items-center">
                      <ShoppingBag className="w-4 h-4 mr-1 text-slate-400" />
                      <span>{card.fee}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-slate-400" />
                      <span>{card.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
