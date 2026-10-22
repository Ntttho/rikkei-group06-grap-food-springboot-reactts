import React from 'react';
import { Star, Zap } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export const HomeBanner: React.FC = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  return (
    <section className="px-4 md:px-8">
      <div
        className="overflow-hidden rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-white"
        ref={emblaRef}
      >
        <div className="flex">
          {/* Slide 1 */}
          <div className="relative flex-[0_0_100%] min-w-0 text-white p-8 md:p-14 min-h-[220px] md:min-h-[320px] flex items-center overflow-hidden bg-rose-900">
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop"
                alt="Food Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-rose-900/95 via-rose-900/70 to-transparent" />
            </div>

            <div className="relative z-20 max-w-lg">
              <span className="inline-flex items-center gap-1.5 bg-rose-500/30 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-rose-400/30 shadow-sm">
                <Zap className="w-3.5 h-3.5 text-yellow-300" />
                Flash Deal Cuối Tuần
              </span>
              <h2 className="text-4xl md:text-6xl font-black mb-3 leading-tight tracking-tight drop-shadow-md">
                Giảm đến 50%
              </h2>
              <p className="text-rose-50 font-medium mb-8 text-base md:text-lg max-w-sm drop-shadow-sm">
                Thỏa sức ăn ngon không lo về giá. Áp dụng cho đơn hàng đầu tiên từ 100k.
              </p>
              <button className="bg-white text-rose-600 px-8 py-3.5 rounded-full font-black text-sm shadow-[0_8px_20px_rgba(225,29,72,0.4)] hover:shadow-[0_8px_25px_rgba(225,29,72,0.6)] hover:-translate-y-0.5 transition-all active:scale-95">
                Săn Mã Ngay
              </button>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="relative flex-[0_0_100%] min-w-0 text-white p-8 md:p-14 min-h-[220px] md:min-h-[320px] flex items-center overflow-hidden bg-amber-900">
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1600&auto=format&fit=crop"
                alt="Food Delivery"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-900/95 via-amber-900/70 to-transparent" />
            </div>

            <div className="relative z-20 max-w-lg">
              <span className="inline-flex items-center gap-1.5 bg-amber-500/30 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-amber-400/30 shadow-sm">
                <Star className="w-3.5 h-3.5 text-yellow-300" />
                FREESHIP XTRA
              </span>
              <h2 className="text-4xl md:text-6xl font-black mb-3 leading-tight tracking-tight drop-shadow-md">
                Giao Hàng 0Đ
              </h2>
              <p className="text-amber-50 font-medium mb-8 text-base md:text-lg max-w-sm drop-shadow-sm">
                Miễn phí giao hàng mọi nẻo đường cho bán kính dưới 3km.
              </p>
              <button className="bg-white text-amber-600 px-8 py-3.5 rounded-full font-black text-sm shadow-[0_8px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_8px_25px_rgba(245,158,11,0.6)] hover:-translate-y-0.5 transition-all active:scale-95">
                Lấy Mã Freeship
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
