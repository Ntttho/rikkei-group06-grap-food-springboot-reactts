import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-20 lg:gap-28">
        {/* Left Side: Image with Blob Mask */}
        <div className="w-full md:w-1/2 flex justify-center relative">
          {/* Decorative outline blob (Figma style) */}
          <div
            className="absolute -inset-4 border border-primary/30 z-0 pointer-events-none"
            style={{ borderRadius: '43% 57% 70% 30% / 44% 39% 61% 56%' }}
          ></div>

          {/* Main Blob Mask */}
          <div
            className="relative z-10 overflow-hidden w-90 h-90 md:w-110 md:h-110 shadow-xl"
            style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
          >
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"
              alt="Delicious food"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Side: Text & Button */}
        <div className="w-full md:w-1/2 flex flex-col items-start text-left">
          <h2 className="text-3xl md:text-4xl font-normal text-slate-900 leading-tight mb-6 tracking-tight">
            Hãy thưởng thức và <br /> tham gia cùng chúng tôi. <br /> Cuộc sống là những hương vị
            bất tận.
          </h2>

          <p className="text-slate-500 text-sm md:text-base mb-8 leading-relaxed max-w-md">
            Trong mắt một nghệ sĩ thực thụ, nghệ thuật là điều cơ bản khó có thể diễn đạt bằng lời.
            Luôn có điều gì đó thiêng liêng về nghệ thuật nấu nướng. Hãy để FlashFood mang đến cho
            bạn những trải nghiệm tuyệt vời nhất.
          </p>

          <button
            onClick={() => navigate('/app')}
            className="group flex items-center gap-2 rounded-full px-8 py-3.5 bg-primary text-white font-medium text-base shadow-md hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <span>Khám Phá Ngay</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};
