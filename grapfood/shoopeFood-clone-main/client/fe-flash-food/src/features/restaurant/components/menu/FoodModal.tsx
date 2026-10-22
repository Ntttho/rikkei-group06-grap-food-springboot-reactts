import React, { useState, useEffect } from 'react';
import { Food, Category, Topping } from '@/types';
import { Button, Input } from '@/components';
import { createFood, updateFood } from '@/services/api';
import { assignToppingsToFood, getToppingsByFood } from '@/services/api/toppings';
import { Sparkles } from 'lucide-react';

interface FoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  food?: Food | null;
  categories: Category[];
  initialCategoryId?: number;
  toppings?: Topping[];
}

export const FoodModal: React.FC<FoodModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  food,
  categories,
  initialCategoryId,
  toppings = [],
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [defaultQuantity, setDefaultQuantity] = useState<string>('100');
  const [selectedToppingIds, setSelectedToppingIds] = useState<number[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(food ? food.name : '');
      setPrice(food ? String(food.price) : '');
      setCategoryId(food ? food.categoryId : initialCategoryId || categories[0]?.id || '');
      setImageUrl(food?.imageUrl || '');
      setIsAvailable(food?.isAvailable ?? true);
      setDefaultQuantity(food ? String(food.defaultQuantity || 100) : '100');
      setError('');
      setSelectedToppingIds([]);

      if (food) {
        // Fetch current toppings of food
        getToppingsByFood(food.id)
          .then((tops) => setSelectedToppingIds(tops.map((t) => t.id)))
          .catch((err) => console.error('Failed to load food toppings', err));
      }
    }
  }, [isOpen, food, initialCategoryId, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !categoryId) {
      setError('Vui lòng điền đủ Tên món, Giá và chọn Danh mục');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        name: name.trim(),
        price: Number(price),
        categoryId: Number(categoryId),
        imageUrl: imageUrl.trim() || undefined,
        isAvailable,
        defaultQuantity: Number(defaultQuantity) || 0,
        currentQuantity: Number(defaultQuantity) || 0,
      };

      let savedFoodId = food?.id;

      if (food) {
        await updateFood(food.id, payload);
      } else {
        const newFood = await createFood(payload);
        savedFoodId = newFood.id;
      }

      if (savedFoodId && toppings.length > 0) {
        await assignToppingsToFood(savedFoodId, selectedToppingIds);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        const errorObj = err as { response?: { data?: { message?: string } } };
        setError(errorObj?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiAutoFill = () => {
    const dishCatalog: Record<string, { image: string; price: number; catKeyword: string }> = {
      phở: {
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80',
        price: 55000,
        catKeyword: 'bún',
      },
      bún: {
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
        price: 50000,
        catKeyword: 'bún',
      },
      cơm: {
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80',
        price: 45000,
        catKeyword: 'cơm',
      },
      gà: {
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80',
        price: 65000,
        catKeyword: 'gà',
      },
      trà: {
        image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=800&q=80',
        price: 35000,
        catKeyword: 'trà',
      },
      burger: {
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
        price: 60000,
        catKeyword: 'burger',
      },
      pizza: {
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
        price: 120000,
        catKeyword: 'ăn vặt',
      },
    };

    const lowerName = name.toLowerCase();
    let matched = Object.entries(dishCatalog).find(([key]) => lowerName.includes(key))?.[1];

    if (!matched && !name.trim()) {
      setName('Bò Bít Tết Sốt Tiêu Đen Thượng Hạng');
      matched = {
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
        price: 95000,
        catKeyword: '',
      };
    } else if (!matched) {
      matched = {
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
        price: 50000,
        catKeyword: '',
      };
    }

    if (matched) {
      if (!price) setPrice(String(matched.price));
      if (!imageUrl) setImageUrl(matched.image);
      if (matched.catKeyword && !categoryId) {
        const foundCat = categories.find((c) =>
          c.name.toLowerCase().includes(matched!.catKeyword)
        );
        if (foundCat) setCategoryId(foundCat.id);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-100 shrink-0 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {food ? 'Chỉnh sửa Món ăn' : 'Thêm Món mới'}
          </h2>
          <button
            type="button"
            onClick={handleAiAutoFill}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
            title="Tự động điền ảnh HD và gợi ý giá thông minh"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Gợi ý</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-slate-700">Tên món ăn</label>
              <span className="text-xs text-slate-400">Nhập tên rồi bấm AI Gợi ý</span>
            </div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Phở Bò Tái Nạm, Trà Sữa..."
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Giá (VNĐ)</label>
              <Input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="VD: 50000"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Danh mục</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full h-11 px-4 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                disabled={isSubmitting || categories.length === 0}
              >
                <option value="" disabled>
                  -- Chọn danh mục --
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Đường dẫn Hình ảnh (URL)
              </label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Số lượng (Phần/Ngày)
              </label>
              <Input
                type="number"
                min="0"
                value={defaultQuantity}
                onChange={(e) => setDefaultQuantity(e.target.value)}
                placeholder="VD: 100"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {imageUrl && (
            <div className="mt-2 w-full h-32 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/400x200?text=Lỗi+ảnh';
                }}
              />
            </div>
          )}

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="isAvailable"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-5 h-5 text-primary rounded focus:ring-primary border-slate-300"
              disabled={isSubmitting}
            />
            <label htmlFor="isAvailable" className="text-sm font-semibold text-slate-700">
              Đang bán (Còn hàng)
            </label>
          </div>

          {toppings.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Chọn Toppings áp dụng
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 border border-slate-100 rounded-xl">
                {toppings.map((topping) => (
                  <label
                    key={topping.id}
                    className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-white rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedToppingIds.includes(topping.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedToppingIds([...selectedToppingIds, topping.id]);
                        } else {
                          setSelectedToppingIds(
                            selectedToppingIds.filter((id) => id !== topping.id)
                          );
                        }
                      }}
                      className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-slate-700">{topping.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm font-semibold text-rose-500">{error}</p>}

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : food ? 'Cập nhật' : 'Thêm món'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
