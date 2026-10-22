import React, { useState } from 'react';
import { Star, Heart } from 'lucide-react';
import { Restaurant } from '@/types';
import { Link } from 'react-router-dom';
import { getDeterministicDistance, getDeterministicTime } from '@/utils/mockUtils';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const [imgError, setImgError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const mockDistance = getDeterministicDistance(restaurant.id);
  const mockTime = getDeterministicTime(mockDistance);

  return (
    <Link
      to={`/app/restaurants/${restaurant.id}`}
      className="bg-white rounded-3xl overflow-hidden border border-slate-100/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer flex flex-col p-3 gap-3"
    >
      <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
        <img
          src={
            !imgError && restaurant.imageUrl
              ? restaurant.imageUrl
              : `https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80`
          }
          alt={restaurant.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full transition-colors"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-white text-white' : 'text-white'}`} />
        </button>
      </div>

      <div className="px-1 pb-1 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-bold text-base text-slate-900 line-clamp-1 tracking-tight">
            {restaurant.name}
          </h4>
          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-slate-700">
              {restaurant.ratingAvg || '4.5'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-2">
          <span>{restaurant.deliveryTime || `${mockTime} mins`}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <span>{restaurant.distanceKm || mockDistance.toFixed(1)} km</span>
        </div>

        <p className="text-xs text-slate-400 line-clamp-1 mt-auto">
          {restaurant.address || 'Dishes, Fast Food, Drinks'}
        </p>
      </div>
    </Link>
  );
};
