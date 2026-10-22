import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';

interface PromoBanner {
  id: string;
  theme: 'dark' | 'light' | 'wood';
  titleTop: string;
  titleMain: string;
  subtitle: string;
  code: string;
  image1: string;
  image2?: string;
}

const BANNERS: PromoBanner[] = [
  {
    id: '1',
    theme: 'dark', // Chalkboard Theme
    titleTop: 'Fresh Delicious',
    titleMain: 'FOOD MENU',
    subtitle: 'Giảm ngay 30% đơn đầu tiên',
    code: 'HUNGRY30',
    image1:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    theme: 'light', // Light Paper Theme
    titleTop: 'Special',
    titleMain: 'COMBO 19K',
    subtitle: 'Freeship mọi đơn dưới 3km',
    code: 'TRASUA19K',
    image1:
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    theme: 'wood', // Wood & Checkered Theme
    titleTop: 'DELICIOUS PIZZA',
    titleMain: 'MUA 1 TẶNG 1',
    subtitle: 'Tặng kèm Pepsi Lớn cho mọi đơn',
    code: 'PIZZA11',
    image1:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
    image2:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
  },
];

export const PromoBannerSection: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(autoplay);
  }, [emblaApi, onSelect]);

  const renderBanner = (banner: PromoBanner) => {
    if (banner.theme === 'dark') {
      return (
        <div className="relative w-full h-70 md:h-85 lg:h-100 overflow-hidden rounded-4xl bg-[#222] bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] text-white flex items-center shadow-lg border border-slate-800">
          {/* Left Side Content */}
          <div className="w-1/2 md:w-3/5 p-6 md:p-12 lg:pl-20 z-10">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-2 md:space-y-4"
            >
              <h4 className="font-script text-3xl md:text-5xl lg:text-6xl text-yellow-400 drop-shadow-md transform -rotate-2">
                {banner.titleTop}
              </h4>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight drop-shadow-lg">
                {banner.titleMain}
              </h2>
              <p className="text-slate-300 text-sm md:text-base font-medium max-w-sm mt-4">
                {banner.subtitle}
              </p>

              <div className="mt-4 md:mt-8 flex items-center gap-3">
                <span className="text-yellow-400 text-2xl">☎</span>
                <div>
                  <p className="text-xs text-yellow-400 font-bold tracking-wider">ORDER NOW</p>
                  <p className="font-mono text-sm md:text-base">{banner.code}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side Image */}
          <div className="w-1/2 md:w-2/5 h-full relative flex items-center justify-center p-4">
            {/* Yellow brush stroke behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-yellow-400 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] rotate-45 opacity-90 mix-blend-screen" />
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring' }}
              className="relative z-10 w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72"
            >
              <img
                src={banner.image1}
                alt="Food"
                className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-slate-900/50"
              />

              {/* Promo Badge */}
              <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-16 h-16 md:w-20 md:h-20 rounded-full bg-yellow-500 flex items-center justify-center border-[3px] border-slate-900 shadow-xl transform -rotate-12">
                <span className="text-slate-900 font-black text-xs md:text-sm text-center leading-tight">
                  50%
                  <br />
                  SAVE
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      );
    }

    if (banner.theme === 'light') {
      return (
        <div className="relative w-full h-70 md:h-85 lg:h-100 overflow-hidden rounded-4xl bg-[#f8f5ee] bg-[url('https://www.transparenttextures.com/patterns/clean-text-patterns.png')] text-slate-900 flex items-center shadow-lg border border-slate-200">
          {/* Decorative Green Circles */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-800 opacity-90 rounded-[40%_60%_70%_30%]" />
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-green-800 rounded-full opacity-90 hidden md:block" />
          <div className="absolute top-10 left-10 w-4 h-4 border border-green-800 rounded-full" />
          <div className="absolute bottom-20 left-1/3 text-green-800 text-xl font-bold">+</div>

          {/* Left Side Content */}
          <div className="w-[55%] md:w-1/2 p-6 md:p-12 lg:pl-24 z-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="space-y-1 md:space-y-2 relative"
            >
              <h4 className="font-script text-4xl md:text-6xl lg:text-7xl text-green-800 drop-shadow-sm transform -rotate-3 text-center md:text-left">
                {banner.titleTop}
              </h4>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-widest text-slate-900 text-center md:text-left">
                {banner.titleMain}
              </h2>
              <p className="text-slate-600 text-xs md:text-sm font-medium mt-4 md:mt-6 text-center md:text-left max-w-sm">
                {banner.subtitle}
              </p>

              <div className="mt-4 md:mt-8 flex justify-center md:justify-start">
                <button className="border-2 border-green-800 text-green-800 px-4 md:px-6 py-2 rounded-full font-bold text-xs md:text-sm hover:bg-green-800 hover:text-white transition-colors">
                  ORDER NOW
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Side Image */}
          <div className="w-[45%] md:w-1/2 h-full relative flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 w-40 h-40 md:w-60 md:h-60 lg:w-80 lg:h-80"
            >
              <img
                src={banner.image1}
                alt="Food"
                className="w-full h-full object-cover rounded-full shadow-2xl border-8 md:border-12 border-white"
              />
            </motion.div>
          </div>
        </div>
      );
    }

    if (banner.theme === 'wood') {
      return (
        <div className="relative w-full h-70 md:h-85 lg:h-100 overflow-hidden rounded-4xl shadow-lg flex items-center justify-center">
          {/* Wood Background */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551269901-5c5e14c25df7?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center brightness-90" />

          {/* Checkered Tablecloth (Left) */}
          <div className="absolute top-0 bottom-0 left-0 w-32 md:w-48 lg:w-64 bg-red-600 bg-[url('https://www.transparenttextures.com/patterns/tablecloth-light.png')] shadow-[10px_0_20px_rgba(0,0,0,0.5)] z-0" />

          {/* Left Images (Overlapping Tablecloth & Wood) */}
          <div className="absolute left-10 md:left-24 lg:left-32 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full border-6 md:border-8 border-white shadow-2xl overflow-hidden -mb-8 relative z-10"
            >
              <img src={banner.image1} alt="Food 1" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-24 h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full border-6 md:border-8 border-white shadow-2xl overflow-hidden relative z-0 -ml-10"
            >
              <img src={banner.image2} alt="Food 2" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          {/* Right Text Content */}
          <div className="absolute right-4 md:right-12 lg:right-24 top-1/2 -translate-y-1/2 z-10 max-w-md md:max-w-xl text-center md:text-right pl-32 md:pl-0">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-wider drop-shadow-xl font-sans"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              {banner.titleTop}
            </motion.h2>

            <div className="w-full h-0.5 border-b-2 border-dotted border-white/60 my-4 md:my-6" />

            <p className="text-white text-sm md:text-base font-medium italic drop-shadow-md">
              {banner.subtitle}
            </p>

            <div className="mt-4 md:mt-6 bg-white inline-block px-4 py-2 md:px-8 md:py-3 shadow-xl transform -skew-x-12">
              <p className="text-slate-900 font-bold text-xs md:text-sm transform skew-x-12 tracking-wide">
                {banner.code}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="px-4 md:px-8 py-4 relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-4">
          {BANNERS.map((banner) => (
            <div key={banner.id} className="min-w-full pl-4 relative">
              {renderBanner(banner)}
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`transition-all duration-300 rounded-full shadow-lg border border-white/50 ${
              index === selectedIndex
                ? 'w-10 h-3 bg-white'
                : 'w-3 h-3 bg-black/40 backdrop-blur-sm hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
