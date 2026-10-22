import React from 'react';
import { Restaurant } from '@/types';
import { Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RestaurantInfoProps {
  restaurant: Restaurant;
}

export const RestaurantInfo: React.FC<RestaurantInfoProps> = ({ restaurant }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-4xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 md:gap-10">
      {/* Image */}
      <div className="w-full md:w-[320px] shrink-0">
        <div className="aspect-4/3 md:aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
          {restaurant.imageUrl ? (
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              Chưa có ảnh
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-center py-2">
        {/* Breadcrumbs */}
        <div className="text-sm text-blue-600 mb-3 flex flex-wrap items-center gap-1.5 font-medium">
          <Link to="/app" className="hover:underline">
            Home
          </Link>
          <span className="text-slate-400 text-xs">»</span>
          <Link to="/app/restaurants" className="hover:underline">
            Hà Nội
          </Link>
          <span className="text-slate-400 text-xs">»</span>
          <span className="text-slate-500 truncate">{restaurant.name}</span>
        </div>

        {/* Type Badge */}
        <div className="mb-2">
          <span className="text-slate-500 text-[11px] font-bold tracking-widest uppercase">
            SHOP ONLINE
          </span>
        </div>

        {/* Name */}
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 leading-tight">
          {restaurant.name}
        </h1>

        {/* Address */}
        <p className="text-slate-600 mb-4 text-sm md:text-base">{restaurant.address}</p>

        {/* Rating and Reviews */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 text-amber-400 fill-current" />
            ))}
          </div>
          <span className="bg-amber-400 text-white text-xs font-bold px-1.5 py-0.5 rounded ml-1">
            {restaurant.ratingAvg || '4.5'}+
          </span>
          <span className="text-slate-500 text-sm font-medium ml-1">đánh giá trên FlashFood</span>
        </div>

        <div className="text-blue-500 text-sm font-medium hover:underline cursor-pointer mb-6">
          Xem thêm lượt đánh giá từ người dùng
        </div>

        {/* Status */}
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-700">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-green-600">Mở cửa</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock className="w-4 h-4" />
            <span>00:00 - 23:59</span>
          </div>
        </div>
      </div>
    </div>
  );
};
