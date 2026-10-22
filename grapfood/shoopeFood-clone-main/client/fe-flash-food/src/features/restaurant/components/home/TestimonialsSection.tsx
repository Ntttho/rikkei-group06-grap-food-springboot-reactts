import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: 'Nguyễn Văn Minh',
      role: 'Khách hàng thân thiết',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      title: 'Dịch vụ giao món tuyệt vời nhất',
      text: 'Đồ ăn được giao rất nhanh, còn nóng hổi. Đội ngũ tài xế lịch sự và nhiệt tình. Rất hài lòng với dịch vụ!',
      highlight: false,
    },
    {
      id: 2,
      name: 'Trần Thị Thu Hà',
      role: 'Food Blogger',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      title: 'Giao diện đặt món hiện đại',
      text: 'Giao diện website mượt mà, nhiều ưu đãi freeship hấp dẫn mỗi ngày. Chắc chắn tôi sẽ sử dụng lâu dài!',
      highlight: false,
    },
    {
      id: 3,
      name: 'Lê Hoàng Nam',
      role: 'Khách hàng',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
      title: 'Món ăn đa dạng phong phú',
      text: 'Món ăn chuẩn vị từ các nhà hàng uy tín. Đặt qua FlashFood luôn được chiết khấu và giao rất đúng giờ.',
      highlight: false,
    },
    {
      id: 4,
      name: 'Phạm Đức Anh',
      role: 'Nhân viên văn phòng',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
      title: 'Tốc độ giao món ấn tượng',
      text: 'Tốc độ giao món trung bình chỉ 15-20 phút, đúng chuẩn tên gọi FlashFood. Dịch vụ cực kỳ chuyên nghiệp!',
      highlight: false,
    },
    {
      id: 5,
      name: 'Vũ Ngọc Ánh',
      role: 'Khách hàng',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
      title: 'Hỗ trợ chu đáo nhiệt tình',
      text: 'Tôi rất ấn tượng với bộ phận chăm sóc khách hàng của FlashFood. Giải quyết thắc mắc rất nhanh chóng.',
      highlight: false,
    },
    {
      id: 6,
      name: 'Hoàng Kim Ngân',
      role: 'Quản lý doanh nghiệp',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
      title: 'Giải pháp đặt cơm trưa số 1',
      text: 'FlashFood mang đến giải pháp tiện lợi trọn vẹn cho dân văn phòng bận rộn như tôi mỗi giờ ăn trưa.',
      highlight: true,
    },
  ];

  return (
    <section className="px-4 md:px-8 py-8">
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Đánh Giá Từ Khách Hàng
        </h2>
        <p className="text-slate-500 text-xs md:text-sm">
          Cảm nhận thực tế từ hàng nghìn khách hàng đã trải nghiệm dịch vụ của FlashFood.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => {
          const isHighlighted = rev.highlight;
          return (
            <div
              key={rev.id}
              className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                isHighlighted
                  ? 'bg-primary text-white border-primary shadow-lg shadow-rose-500/20 -translate-y-0.5'
                  : 'bg-white text-slate-900 border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Quote
                    className={`w-7 h-7 ${isHighlighted ? 'text-rose-200' : 'text-primary/30'}`}
                  />
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <h4
                  className={`text-base font-black mb-2 ${
                    isHighlighted ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  "{rev.title}"
                </h4>

                <p
                  className={`text-xs md:text-sm leading-relaxed mb-5 ${
                    isHighlighted ? 'text-rose-100' : 'text-slate-500'
                  }`}
                >
                  {rev.text}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100/30">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h5
                    className={`text-xs font-bold ${
                      isHighlighted ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {rev.name}
                  </h5>
                  <p
                    className={`text-[11px] ${isHighlighted ? 'text-rose-200' : 'text-slate-400'}`}
                  >
                    {rev.role}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
