import React from 'react';
import { Sparkles, Bell, Search, MapPin, Navigation, Clock } from 'lucide-react';

export const AppDownloadSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="bg-slate-900 rounded-[2.5rem] px-8 py-10 md:px-16 md:py-12 relative flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-2xl">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl" />

          {/* Left Side: Future Vision Text */}
          <div className="relative z-10 w-full md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-rose-300 border border-primary/40 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Định Hướng Tương Lai • Mobile App</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
              Mở rộng hệ sinh thái <br /> với ứng dụng Di Động
            </h2>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-7 max-w-md mx-auto md:mx-0">
              FlashFood hướng tới ra mắt ứng dụng di động hỗ trợ bản đồ thời gian thực (Google Maps
              GPS Tracking), giúp bạn theo dõi từng bước di chuyển của tài xế và nhận thông báo món
              ăn nóng hổi ngay lập tức.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-full px-7 py-3.5 font-bold transition-all shadow-lg hover:shadow-primary/30 active:scale-95 cursor-pointer">
                <Bell className="mr-2 h-5 w-5" />
                Nhận thông báo khi ra mắt
              </button>
            </div>
          </div>

          {/* Right Side: Ultra Crisp Pure React Mobile UI Mockup */}
          <div className="relative z-10 w-full md:w-5/12 flex justify-center">
            {/* Phone Glow Effect */}
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-2 bg-linear-to-r from-primary to-rose-500 rounded-[3.2rem] blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Phone Frame - Reduced Height */}
              <div className="relative w-65 md:w-67.5 h-107.5 bg-slate-950 rounded-[2.5rem] border-[9px] border-slate-700 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/20 overflow-hidden flex flex-col justify-between transform rotate-2 group-hover:rotate-0 transition-transform duration-500">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-22 h-4.5 bg-black rounded-full flex items-center justify-end px-2 border border-slate-800">
                  <div className="w-2 h-2 bg-slate-900 rounded-full border border-slate-700" />
                </div>

                {/* Simulated Mobile App UI Inside Phone */}
                <div className="w-full h-full bg-slate-900 text-white pt-8 px-3.5 pb-3 flex flex-col justify-between overflow-hidden select-none">
                  {/* App Header */}
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <div>
                        <span className="text-[9px] text-rose-400 font-bold uppercase tracking-wider">
                          FlashFood App
                        </span>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1">
                          <span>Hà Nội</span>
                          <MapPin className="w-3 h-3 text-primary" />
                        </h4>
                      </div>
                      <div className="w-6 h-6 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-bold text-primary">
                        FF
                      </div>
                    </div>

                    {/* Mini Search Bar */}
                    <div className="bg-slate-800/90 rounded-xl px-2.5 py-1.5 flex items-center gap-2 mb-3 border border-slate-700/50">
                      <Search className="w-3 h-3 text-slate-400" />
                      <span className="text-[11px] text-slate-400">Tìm kiếm món ăn...</span>
                    </div>

                    {/* Active Order Card */}
                    <div className="bg-slate-800/60 rounded-xl p-2 border border-slate-700/50 mb-2">
                      <div className="h-24 rounded-lg overflow-hidden relative mb-1.5">
                        <img
                          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop"
                          alt="Burger"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1.5 left-1.5 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                          Đang giao
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-[11px] font-bold text-white">Burger Bò Phô Mai</div>
                          <div className="text-[9px] text-slate-400">FlashFood Express</div>
                        </div>
                        <span className="text-[11px] font-bold text-rose-400">45.000đ</span>
                      </div>
                    </div>
                  </div>

                  {/* Realtime Live Tracking Card at Bottom */}
                  <div className="bg-linear-to-r from-rose-900/90 to-primary/90 rounded-xl p-2.5 shadow-lg border border-rose-500/30">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white shrink-0">
                        <Navigation className="w-3.5 h-3.5 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-white">Tài xế đang đến</div>
                        <div className="text-[9px] text-rose-100 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Dự kiến: 12 phút (1.2 km)</span>
                        </div>
                      </div>
                    </div>
                    {/* Live Progress Bar */}
                    <div className="w-full bg-black/30 h-1 rounded-full overflow-hidden">
                      <div className="bg-white h-full w-3/4 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
