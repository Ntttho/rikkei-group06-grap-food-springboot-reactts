import React from 'react';
import { Smartphone, ShieldCheck, Award, Zap } from 'lucide-react';

export const AppDownloadShowcase: React.FC = () => {
  return (
    <section className="px-4 md:px-8 py-12">
      <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-14 border border-slate-100 overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side */}
          <div className="lg:col-span-6 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              Tasty Food is available for your Android or Apple.
            </h2>

            <p className="text-slate-500 text-base leading-relaxed max-w-md">
              Tải ngay ứng dụng FlashFood trên iOS và Android để nhận vô vàn ưu đãi độc quyền cùng
              tốc độ giao món nhanh chóng.
            </p>

            {/* App Store Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button className="flex items-center gap-3 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-md">
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    GET IT ON
                  </div>
                  <div className="text-sm font-black tracking-wide">Google Play</div>
                </div>
              </button>

              <button className="flex items-center gap-3 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-md">
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    DOWNLOAD ON THE
                  </div>
                  <div className="text-sm font-black tracking-wide">App Store</div>
                </div>
              </button>
            </div>

            {/* Trusted Partner Badges */}
            <div className="pt-8 border-t border-slate-200/60 flex items-center gap-8 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Safe
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> Top Rated
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-rose-500" /> Super Fast
              </span>
            </div>
          </div>

          {/* Right Side Mockups */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end gap-4 relative">
            <div className="w-56 md:w-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-slate-900 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80"
                alt="App Showcase 1"
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="w-56 md:w-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-slate-900 transform rotate-6 translate-y-6 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80"
                alt="App Showcase 2"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
