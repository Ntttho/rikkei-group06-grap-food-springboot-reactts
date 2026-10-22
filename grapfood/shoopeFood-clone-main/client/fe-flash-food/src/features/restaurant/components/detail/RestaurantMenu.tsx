import React, { useMemo, useState } from 'react';
import { Food, Category } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { Search, Plus, Utensils } from 'lucide-react';

interface RestaurantMenuProps {
  categories: Category[];
  foods: Food[];
  onFoodClick: (food: Food) => void;
}

export const RestaurantMenu: React.FC<RestaurantMenuProps> = ({
  categories,
  foods,
  onFoodClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Group foods by category
  const groupedFoods = useMemo(() => {
    const groups: Record<number, Food[]> = {};
    const filteredFoods = foods.filter((food) =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filteredFoods.forEach((food) => {
      if (!groups[food.categoryId]) {
        groups[food.categoryId] = [];
      }
      groups[food.categoryId].push(food);
    });

    return groups;
  }, [foods, searchTerm]);

  // Only show categories that have foods
  const activeCategories = categories.filter(
    (c) => groupedFoods[c.id] && groupedFoods[c.id].length > 0
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar - Categories */}
      <div className="w-full lg:w-60 shrink-0">
        <div className="sticky top-20 bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h3 className="font-bold text-slate-800 mb-3 uppercase tracking-widest text-xs flex items-center gap-2">
            <Utensils className="w-4 h-4 text-primary" />
            Thực đơn
          </h3>
          <ul className="space-y-1">
            {activeCategories.map((category) => (
              <li key={category.id}>
                <a
                  href={`#category-${category.id}`}
                  className="block px-3 py-2 text-sm text-slate-600 hover:text-primary hover:bg-red-50 rounded-lg transition-colors font-medium truncate"
                >
                  {category.name}
                </a>
              </li>
            ))}
            {activeCategories.length === 0 && (
              <li className="px-4 py-2 text-slate-400 italic text-sm">Không tìm thấy món ăn</li>
            )}
          </ul>
        </div>
      </div>

      {/* Main Menu Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Search Bar Wrapper */}
        <div className="p-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 focus-within:border-primary/50 focus-within:bg-white transition-colors">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              placeholder="Tìm món..."
              className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Food Lists */}
        <div className="p-0">
          {activeCategories.map((category) => (
            <div key={category.id} id={`category-${category.id}`} className="scroll-mt-24">
              <div className="bg-slate-50 px-4 py-2.5 border-y border-slate-100 first:border-t-0">
                <h4 className="font-bold text-slate-700 uppercase tracking-wide text-xs">
                  {category.name}
                </h4>
              </div>

              <div className="divide-y divide-slate-100">
                {groupedFoods[category.id].map((food) => {
                  const isUnavailable = !food.isAvailable || food.currentQuantity === 0;
                  return (
                    <div
                      key={food.id}
                      className="flex items-center p-4 gap-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                      onClick={() => onFoodClick(food)}
                    >
                      {/* Thumbnail */}
                      <div className="w-20 h-20 md:w-22.5 md:h-22.5 rounded-lg overflow-hidden bg-slate-100 shrink-0 relative border border-slate-200/60">
                        {food.imageUrl ? (
                          <img
                            src={food.imageUrl}
                            alt={food.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Utensils className="w-5 h-5" />
                          </div>
                        )}
                        {isUnavailable && (
                          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Hết
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h5 className="font-bold text-slate-800 text-[15px] mb-1 line-clamp-2">
                          {food.name}
                        </h5>
                        <span className="text-xs text-slate-500 line-clamp-1">Đã bán 100+</span>
                      </div>

                      {/* Price and Add Button */}
                      <div className="flex items-center gap-4 shrink-0 pr-2">
                        <span className="font-bold text-blue-600 text-[15px]">
                          {formatCurrency(food.price)}
                        </span>
                        <button
                          disabled={isUnavailable}
                          className="w-7 h-7 md:w-8 md:h-8 rounded-md bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:bg-slate-300"
                        >
                          <Plus className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {activeCategories.length === 0 && (
            <div className="p-10 text-center text-slate-500">
              Không có món ăn nào khớp với tìm kiếm của bạn.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
