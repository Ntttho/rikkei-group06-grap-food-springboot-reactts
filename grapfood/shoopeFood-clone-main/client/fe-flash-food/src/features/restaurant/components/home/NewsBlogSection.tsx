import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';

export const NewsBlogSection: React.FC = () => {
  const blogs = [
    {
      id: 1,
      title: 'Thói quen chọn món Healthy hỗ trợ sức khỏe tim mạch',
      desc: 'Bí quyết lựa chọn các món ăn chế biến thanh nhẹ giúp thanh lọc cơ thể và nâng cao sức đề kháng hiệu quả.',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80',
      date: '2 Tháng 8, 2026',
    },
    {
      id: 2,
      title: 'Bí quyết ăn uống lành mạnh năng động mỗi ngày',
      desc: 'Những thói quen dinh dưỡng hợp lý cùng danh sách các thực phẩm tự nhiên hỗ trợ hệ tiêu hóa hiệu quả.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80',
      date: '2 Tháng 8, 2026',
    },
    {
      id: 3,
      title: 'Khám phá nét đẹp văn hóa thưởng thức ẩm thực giao tận nơi',
      desc: 'Tìm hiểu xu hướng giao đồ ăn nhanh chóng tiện lợi và lý do FlashFood trở thành sự lựa chọn hàng đầu.',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
      date: '2 Tháng 8, 2026',
    },
  ];

  return (
    <section className="px-4 md:px-8 py-8">
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Tin Tức & Mẹo Hay
        </h2>
        <p className="text-slate-500 text-xs md:text-sm">
          Cập nhật những bài viết, kiến thức ẩm thực và mẹo sống khỏe mới nhất cùng FlashFood.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col cursor-pointer"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-700 flex items-center gap-1.5 shadow-sm">
                <Calendar className="w-3 h-3 text-primary" />
                {item.date}
              </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-base font-black text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                {item.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">
                {item.desc}
              </p>

              <button className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                Đọc tiếp <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
