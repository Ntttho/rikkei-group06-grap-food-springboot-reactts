import React from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-[420px] md:h-[480px] flex items-center justify-center mt-20">
      {/* Background Image with Dark Overlay */}
      <div
        className="absolute inset-0 z-0 bg-slate-900"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2000&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 text-center w-full max-w-5xl px-4">
        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-normal text-white mb-8 tracking-wide leading-tight">
          Món ăn yêu thích, giao tận cửa nhà bạn
        </h1>

        {/* Search Bar matching Figma exactly */}
        <div className="max-w-3xl mx-auto bg-white rounded-full flex items-center shadow-xl overflow-hidden h-14">
          {/* Location Selector / Indicator */}
          <div className="flex items-center pl-6 pr-5 border-r border-slate-200 shrink-0 text-slate-700 font-medium text-sm md:text-base cursor-pointer">
            <MapPin className="text-primary w-5 h-5 mr-2 shrink-0" />
            <span>Hà Nội</span>
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Nhập món ăn hoặc địa chỉ giao hàng..."
            className="flex-grow px-5 bg-transparent border-none focus:outline-none text-slate-800 text-sm md:text-base placeholder:text-slate-400"
          />

          {/* Search Button (Flush with right edge) */}
          <button
            onClick={() => navigate('/app')}
            className="h-full px-8 bg-primary hover:bg-primary/90 text-white font-medium text-base flex items-center justify-center transition-colors shrink-0 rounded-r-full"
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </section>
  );
};
