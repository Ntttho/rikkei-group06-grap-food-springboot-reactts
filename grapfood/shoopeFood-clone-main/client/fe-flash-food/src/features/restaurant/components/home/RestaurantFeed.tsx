import React, { useState } from 'react';
import { MapPin, TrendingUp, ThumbsUp, Tag } from 'lucide-react';
import { Restaurant } from '@/types';
import { Link } from 'react-router-dom';
import { RestaurantCard } from './RestaurantCard';

interface RestaurantFeedProps {
  restaurants: Restaurant[];
}

export const RestaurantFeed: React.FC<RestaurantFeedProps> = ({ restaurants }) => {
  const [activeFilter, setActiveFilter] = useState('Gần tôi');

  const filters = [
    { name: 'Gần tôi', icon: MapPin },
    { name: 'Bán chạy', icon: TrendingUp },
    { name: 'Đánh giá cao', icon: ThumbsUp },
    { name: 'Khuyến mãi', icon: Tag },
  ];

  const getSortedRestaurants = () => {
    const list = [...restaurants];
    switch (activeFilter) {
      case 'Đánh giá cao':
        return list.sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0));
      case 'Bán chạy':
        return list.sort((a, b) => (b.id % 10) - (a.id % 10)); // pseudo sorting for demo
      case 'Khuyến mãi':
        return list.filter((r) => r.id % 3 === 0); // pseudo filter for demo
      case 'Gần tôi':
      default:
        return list;
    }
  };

  const displayedRestaurants = getSortedRestaurants();

  return (
    <section className="px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Top Nhà Hàng Nổi Bật
        </h3>

        {/* Smart Filters */}
        <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 scrollbar-hide">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.name;
            return (
              <button
                key={filter.name}
                onClick={() => setActiveFilter(filter.name)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {filter.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedRestaurants.slice(0, 8).map((item, i) => (
          <RestaurantCard key={item.id || i} restaurant={item} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          to="/app/restaurants"
          className="inline-flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-colors"
        >
          Xem Tất Cả Nhà Hàng
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
};
