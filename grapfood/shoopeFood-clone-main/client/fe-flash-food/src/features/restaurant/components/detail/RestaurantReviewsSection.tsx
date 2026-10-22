import React, { useEffect, useState } from 'react';
import { Star, MessageSquareQuote, ThumbsUp } from 'lucide-react';
import { reviewApi, ReviewItem } from '@/services/api/review';

interface RestaurantReviewsSectionProps {
  restaurantId: number;
}

export const RestaurantReviewsSection: React.FC<RestaurantReviewsSectionProps> = ({
  restaurantId,
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [summary, setSummary] = useState<{ totalReviews: number; averageRating: number } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const [reviewList, summaryData] = await Promise.all([
          reviewApi.getRestaurantReviews(restaurantId).catch(() => []),
          reviewApi.getRestaurantSummary(restaurantId).catch(() => null),
        ]);
        setReviews(reviewList || []);
        if (summaryData) {
          setSummary({
            totalReviews: summaryData.totalReviews || (reviewList ? reviewList.length : 0),
            averageRating: summaryData.averageRating || 5.0,
          });
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) fetchReviews();
  }, [restaurantId]);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-primary" />
            <span>Đánh Giá Từ Khách Hàng</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp nhận xét thực tế từ khách hàng đã trải nghiệm món ăn
          </p>
        </div>

        {summary && summary.totalReviews > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200/60">
            <div className="text-2xl font-black text-amber-700">{summary.averageRating}</div>
            <div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= Math.round(summary.averageRating)
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] font-semibold text-amber-800">
                {summary.totalReviews} lượt đánh giá
              </span>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Đang tải nhận xét...</div>
      ) : reviews.length === 0 ? (
        <div className="py-10 text-center text-slate-400">
          <ThumbsUp className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-600">Chưa có đánh giá nào</p>
          <p className="text-xs text-slate-400 mt-1">
            Hãy đặt món và trở thành người đầu tiên chia sẻ cảm nhận về quán nhé!
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 mt-4">
          {reviews.map((rev) => {
            const dateStr = rev.createdAt
              ? new Date(rev.createdAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : '';

            return (
              <div key={rev.id} className="py-4 first:pt-2 last:pb-2 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                      {rev.customer?.fullName ? rev.customer.fullName.charAt(0) : 'K'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800">
                        {rev.customer?.fullName || 'Khách hàng'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{dateStr}</span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= (rev.rating || 5)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed pl-10">
                  {rev.comment || 'Món ăn ngon và phục vụ tốt.'}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
