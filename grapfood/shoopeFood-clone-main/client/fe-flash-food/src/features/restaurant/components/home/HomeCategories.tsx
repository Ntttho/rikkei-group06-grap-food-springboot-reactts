import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Category } from '@/types';
import { CategoryItem } from './CategoryItem';

interface HomeCategoriesProps {
  categories: Category[];
}

export const HomeCategories: React.FC<HomeCategoriesProps> = ({ categories }) => {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps',
  });

  // Lọc các danh mục trùng lặp (nếu có do data cũ) và lấy tối đa 14 danh mục nổi bật nhất
  const uniqueCategories = Array.from(new Map(categories.map((c) => [c.name, c])).values());
  const displayCategories = uniqueCategories.slice(0, 14);

  return (
    <section className="px-4 md:px-8 py-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Khám phá Danh Mục
        </h3>
      </div>

      <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex gap-4 md:gap-6 py-2">
          {displayCategories.map((cat, i) => (
            <div key={cat.id || i} className="flex-none">
              <CategoryItem category={cat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
