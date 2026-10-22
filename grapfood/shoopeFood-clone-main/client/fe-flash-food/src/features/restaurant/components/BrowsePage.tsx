import React, { useState, useEffect } from 'react';
import { Search, MapPin, TrendingUp, ThumbsUp, Tag, Utensils } from 'lucide-react';
import { restaurantApi } from '../services/restaurantApi';
import { RestaurantCard } from './home/RestaurantCard';
import { Restaurant } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';

export const BrowsePage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Gần tôi');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Khi thay đổi search hoặc filter, reset lại page về 1
  useEffect(() => {
    setPage(1);
    setRestaurants([]);
  }, [debouncedSearch, activeFilter]);

  const filters = [
    { name: 'Gần tôi', icon: MapPin },
    { name: 'Bán chạy', icon: TrendingUp },
    { name: 'Đánh giá cao', icon: ThumbsUp },
    { name: 'Khuyến mãi', icon: Tag },
  ];

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const res = await restaurantApi.getRestaurants({
          search: debouncedSearch,
          page,
          limit: 12,
        });

        const newItems = res.data || [];
        setRestaurants((prev) => (page === 1 ? newItems : [...prev, ...newItems]));

        if (res.pagination) {
          setHasMore(res.pagination.page < res.pagination.totalPages);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    fetchRestaurants();
  }, [debouncedSearch, activeFilter, page]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Khám Phá Quán Ngon
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Hàng ngàn lựa chọn đang chờ bạn</p>
          </div>

          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm quán ăn, món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide mb-6">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.name;
            return (
              <button
                key={filter.name}
                onClick={() => setActiveFilter(filter.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {filter.name}
              </button>
            );
          })}
        </div>

        {/* Grid / Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm animate-pulse"
              >
                <div className="w-full h-40 bg-slate-200 rounded-xl mb-4" />
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-200 rounded w-1/2 mb-4" />
                <div className="flex justify-between">
                  <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
                  <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurants.map((item) => (
              <div
                key={item.id}
                onClick={() => (window.location.href = `/app/restaurants/${item.id}`)}
              >
                <RestaurantCard restaurant={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-4">
              <Utensils className="w-10 h-10 text-primary opacity-50" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Không tìm thấy quán ăn</h3>
            <p className="text-slate-500 max-w-sm">
              Rất tiếc, chúng tôi không tìm thấy kết quả phù hợp với từ khóa "{searchTerm}". Vui
              lòng thử lại với từ khóa khác.
            </p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loadingMore}
              className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-primary rounded-full animate-spin" />
                  Đang tải...
                </>
              ) : (
                'Tải thêm'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
