import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useRestaurant } from '@/context';
import { Category, Food, Restaurant, Topping } from '@/types';
import {
  getMyRestaurants,
  getCategories,
  getFoods,
  deleteCategory,
  deleteFood,
} from '@/services/api';
import { Button } from '@/components';
import { formatCurrency } from '@/utils';
import { Plus, Edit2, Trash2, Tag, UtensilsCrossed } from 'lucide-react';
import { CategoryModal } from './CategoryModal';
import { FoodModal } from './FoodModal';
import { ToppingModal } from './ToppingModal';
import { getToppingsByRestaurant, deleteTopping } from '@/services/api/toppings';

export const MerchantMenuManager: React.FC = () => {
  const { selectedRestaurantId } = useRestaurant();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [activeTab, setActiveTab] = useState<'FOODS' | 'TOPPINGS'>('FOODS');

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  const [isToppingModalOpen, setIsToppingModalOpen] = useState(false);
  const [editingTopping, setEditingTopping] = useState<Topping | null>(null);

  const fetchCategoriesAndFoods = async (resId: number) => {
    try {
      const [cats, fds, tops] = await Promise.all([
        getCategories({ restaurantId: resId }),
        getFoods({ restaurantId: resId }),
        getToppingsByRestaurant(resId),
      ]);
      setCategories(cats);
      setFoods(fds);
      setToppings(tops);

      if (cats.length > 0 && selectedCategoryId === null) {
        setSelectedCategoryId(cats[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadInitialData = async () => {
    if (!selectedRestaurantId) return;
    try {
      setIsLoading(true);
      const myRestaurants = await getMyRestaurants();
      const res = myRestaurants.find((r) => r.id === selectedRestaurantId);

      if (res) {
        setRestaurant(res);
        await fetchCategoriesAndFoods(res.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRestaurantId) {
      loadInitialData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRestaurantId]);

  const handleDeleteCategory = async (id: number) => {
    if (
      !window.confirm(
        'Bạn có chắc chắn muốn xóa Danh mục này? Tất cả các món ăn bên trong có thể sẽ bị ảnh hưởng.'
      )
    )
      return;
    try {
      await deleteCategory(id);
      if (restaurant) fetchCategoriesAndFoods(restaurant.id);
      if (selectedCategoryId === id) setSelectedCategoryId(null);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      alert(errorObj?.response?.data?.message || 'Không thể xóa danh mục');
    }
  };

  const handleDeleteFood = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa Món ăn này?')) return;
    try {
      await deleteFood(id);
      if (restaurant) fetchCategoriesAndFoods(restaurant.id);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      alert(errorObj?.response?.data?.message || 'Không thể xóa món ăn');
    }
  };

  const handleDeleteTopping = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa Topping này?')) return;
    try {
      await deleteTopping(id);
      if (restaurant) fetchCategoriesAndFoods(restaurant.id);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      alert(errorObj?.response?.data?.message || 'Không thể xóa topping');
    }
  };

  const displayedFoods = selectedCategoryId
    ? foods.filter((f) => f.categoryId === selectedCategoryId)
    : foods;

  if (!selectedRestaurantId) {
    return <Navigate to="/merchant/restaurants" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800">Chưa có thông tin cửa hàng</h3>
        <p className="text-slate-500 mt-2">
          Vui lòng cập nhật thông tin cửa hàng trước khi tạo thực đơn.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Quản lý Thực đơn</h1>
          <p className="text-slate-500 mt-1">
            Cửa hàng: <span className="font-bold text-primary">{restaurant.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setActiveTab('FOODS')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                activeTab === 'FOODS'
                  ? 'bg-white shadow-sm text-primary'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Món ăn
            </button>
            <button
              onClick={() => setActiveTab('TOPPINGS')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                activeTab === 'TOPPINGS'
                  ? 'bg-white shadow-sm text-primary'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Toppings
            </button>
          </div>
          <Button
            onClick={() => {
              if (activeTab === 'FOODS') {
                setEditingFood(null);
                setIsFoodModalOpen(true);
              } else {
                setEditingTopping(null);
                setIsToppingModalOpen(true);
              }
            }}
            className="bg-primary hover:bg-orange-600 font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/30"
            disabled={activeTab === 'FOODS' && categories.length === 0}
          >
            <Plus className="w-5 h-5" /> Thêm {activeTab === 'FOODS' ? 'Món Mới' : 'Topping'}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cột Trái: Danh mục */}
        <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-4">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" /> Danh Mục
              </h2>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setIsCategoryModalOpen(true);
                }}
                className="text-sm font-bold text-primary hover:bg-orange-50 p-2 rounded-lg transition-colors"
                title="Thêm danh mục"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 flex flex-col gap-2 max-h-[600px] overflow-y-auto">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`flex items-center justify-between p-3 rounded-xl text-left transition-colors font-semibold ${
                  selectedCategoryId === null
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Tất cả món ăn
                <span
                  className={`text-xs px-2 py-1 rounded-full ${selectedCategoryId === null ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}
                >
                  {foods.length}
                </span>
              </button>

              {categories.map((cat) => {
                const count = foods.filter((f) => f.categoryId === cat.id).length;
                const isSelected = selectedCategoryId === cat.id;

                return (
                  <div
                    key={cat.id}
                    className={`group flex items-center justify-between p-3 rounded-xl transition-colors font-semibold cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedCategoryId(cat.id)}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="truncate">{cat.name}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}
                      >
                        {count}
                      </span>
                      <div
                        className={`flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'text-white' : 'text-slate-400'}`}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCategory(cat);
                            setIsCategoryModalOpen(true);
                          }}
                          className="hover:scale-110 p-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(cat.id);
                          }}
                          className="hover:scale-110 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {categories.length === 0 && (
                <div className="text-center p-6 text-slate-400">
                  <p className="text-sm">Chưa có danh mục nào.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cột Phải: Nội dung (Món ăn hoặc Toppings) */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 min-h-[500px]">
          {activeTab === 'FOODS' ? (
            <>
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <UtensilsCrossed className="w-6 h-6 text-primary" />
                {selectedCategoryId === null
                  ? 'Tất cả món ăn'
                  : categories.find((c) => c.id === selectedCategoryId)?.name || 'Món ăn'}
              </h2>

              {categories.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Tag className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Tạo danh mục trước nhé!</h3>
                  <p className="text-slate-500 mb-4 text-sm max-w-sm mx-auto">
                    Bạn cần tạo ít nhất một danh mục (VD: Đồ ăn, Nước uống) trước khi có thể thêm
                    món.
                  </p>
                  <Button
                    onClick={() => {
                      setEditingCategory(null);
                      setIsCategoryModalOpen(true);
                    }}
                  >
                    Thêm danh mục ngay
                  </Button>
                </div>
              ) : displayedFoods.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UtensilsCrossed className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Chưa có món ăn nào</h3>
                  <p className="text-slate-500 mb-4 text-sm max-w-sm mx-auto">
                    Danh mục này hiện chưa có món ăn. Bấm thêm mới để làm phong phú thực đơn của
                    bạn.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingFood(null);
                      setIsFoodModalOpen(true);
                    }}
                  >
                    Thêm món vào danh mục
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
                  {displayedFoods.map((food) => (
                    <div
                      key={food.id}
                      className="group relative bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 transition-all hover:shadow-lg hover:border-primary/30"
                    >
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        {food.imageUrl ? (
                          <img
                            src={food.imageUrl}
                            alt={food.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://via.placeholder.com/150?text=Lỗi+ảnh';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <UtensilsCrossed className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3
                              className="font-bold text-slate-900 leading-tight truncate"
                              title={food.name}
                            >
                              {food.name}
                            </h3>
                          </div>
                          <p className="text-primary font-black mt-1">
                            {formatCurrency(food.price)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-md ${food.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                          >
                            {food.isAvailable ? 'Đang bán' : 'Hết hàng'}
                          </span>

                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingFood(food);
                                setIsFoodModalOpen(true);
                              }}
                              className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                              title="Sửa"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFood(food.id)}
                              className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            // TOPPINGS TAB
            <>
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Tag className="w-6 h-6 text-primary" /> Tất cả Toppings
              </h2>
              {toppings.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Tag className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Chưa có Topping nào</h3>
                  <p className="text-slate-500 mb-4 text-sm max-w-sm mx-auto">
                    Thêm Topping để khách hàng có thể tùy biến món ăn của họ (Ví dụ: Thêm trân châu,
                    phô mai).
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {toppings.map((topping) => (
                    <div
                      key={topping.id}
                      className="group relative bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2 transition-all hover:shadow-lg hover:border-primary/30"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-900">{topping.name}</h3>
                        <p className="text-primary font-black">{formatCurrency(topping.price)}</p>
                      </div>
                      <div className="flex justify-between text-sm text-slate-500 mt-2">
                        <span>
                          Kho: {topping.currentQuantity}/{topping.defaultQuantity}
                        </span>
                        <span
                          className={
                            topping.isAvailable ? 'text-emerald-600 font-bold' : 'text-slate-400'
                          }
                        >
                          {topping.isAvailable ? 'Mở bán' : 'Tạm ẩn'}
                        </span>
                      </div>
                      <div className="flex justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingTopping(topping);
                            setIsToppingModalOpen(true);
                          }}
                          className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTopping(topping.id)}
                          className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={() => fetchCategoriesAndFoods(restaurant.id)}
        category={editingCategory}
        restaurantId={restaurant.id}
      />

      <FoodModal
        isOpen={isFoodModalOpen}
        onClose={() => setIsFoodModalOpen(false)}
        onSuccess={() => fetchCategoriesAndFoods(restaurant.id)}
        food={editingFood}
        categories={categories}
        initialCategoryId={selectedCategoryId || undefined}
        toppings={toppings} // Pass available toppings to FoodModal
      />

      <ToppingModal
        isOpen={isToppingModalOpen}
        onClose={() => setIsToppingModalOpen(false)}
        onSuccess={() => fetchCategoriesAndFoods(restaurant.id)}
        topping={editingTopping}
        restaurantId={restaurant.id}
      />
    </div>
  );
};
