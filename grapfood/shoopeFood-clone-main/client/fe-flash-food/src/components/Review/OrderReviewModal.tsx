import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, ThumbsUp, Utensils, Bike } from 'lucide-react';
import { reviewApi } from '@/services/api/review';
import { toast } from 'sonner';

interface OrderReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  restaurantId?: number;
  restaurantName?: string;
  driverId?: number;
  driverName?: string;
  onSuccess?: () => void;
}

const QUICK_TAGS = [
  'Món ăn nóng hổi',
  'Hương vị tuyệt hảo',
  'Giao siêu nhanh',
  'Đóng gói cẩn thận',
  'Tài xế lịch sự',
  'Đúng yêu cầu ghi chú',
];

export const OrderReviewModal: React.FC<OrderReviewModalProps> = ({
  isOpen,
  onClose,
  orderId,
  restaurantId = 1,
  restaurantName = 'Quán ăn',
  driverId,
  driverName = 'Tài xế',
  onSuccess,
}) => {
  const [restaurantRating, setRestaurantRating] = useState(5);
  const [driverRating, setDriverRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleTagClick = (tag: string) => {
    setComment((prev) => (prev ? `${prev}, ${tag}` : tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Review restaurant
      await reviewApi.createReview({
        orderId,
        targetType: 'RESTAURANT',
        targetId: restaurantId,
        rating: restaurantRating,
        comment: comment.trim() || 'Rất hài lòng!',
      });

      // Review driver if exists
      if (driverId) {
        await reviewApi.createReview({
          orderId,
          targetType: 'DRIVER',
          targetId: driverId,
          rating: driverRating,
          comment: 'Giao hàng tốt!',
        });
      }

      toast.success('Cảm ơn bạn đã gửi đánh giá!');
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      console.error('Failed to submit review:', err);
      const errorObj = err as { response?: { data?: { message?: string } } };
      toast.error(errorObj?.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50 to-amber-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Đánh Giá Đơn Hàng #{orderId}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Chia sẻ cảm nhận của bạn để nâng cao chất lượng phục vụ</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
              {/* Restaurant Rating */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <Utensils className="w-4 h-4 text-primary" />
                  <span>Chất lượng món ăn ({restaurantName})</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRestaurantRating(star)}
                      className="p-1 text-slate-300 hover:scale-115 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= restaurantRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">
                    {restaurantRating === 5
                      ? 'Tuyệt vời'
                      : restaurantRating === 4
                      ? 'Hài lòng'
                      : restaurantRating === 3
                      ? 'Bình thường'
                      : restaurantRating === 2
                      ? 'Chưa hài lòng'
                      : 'Rất tệ'}
                  </span>
                </div>
              </div>

              {/* Driver Rating */}
              {driverId && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <Bike className="w-4 h-4 text-emerald-600" />
                    <span>Dịch vụ giao hàng ({driverName})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setDriverRating(star)}
                        className="p-1 text-slate-300 hover:scale-115 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= driverRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Gợi ý nhanh</label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-primary transition-colors cursor-pointer"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Nhận xét chi tiết (tùy chọn)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Món ăn hôm nay thế nào? Hãy để lại vài lời nhận xét nhé..."
                  className="w-full p-3.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  disabled={submitting}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  disabled={submitting}
                >
                  Bỏ qua
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-rose-700 transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{submitting ? 'Đang gửi...' : 'Gửi đánh giá'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
