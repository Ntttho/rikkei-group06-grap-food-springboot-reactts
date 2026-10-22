import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantApi } from '../services/restaurantApi';
import { Restaurant, Food, Topping, Category } from '@/types';
import { ToppingModal } from './ToppingModal';
import { useCart } from '@/context';
import { RestaurantInfo } from './detail/RestaurantInfo';
import { RestaurantMenu } from './detail/RestaurantMenu';
import { RestaurantReviewsSection } from './detail/RestaurantReviewsSection';

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resData, catData, menuData] = await Promise.all([
          restaurantApi.getRestaurantById(id!),
          restaurantApi.getCategories(id!),
          restaurantApi.getMenu(id!),
        ]);
        setRestaurant(resData.data);
        setCategories(catData.data || []);
        setMenu(menuData.data || []);
      } catch (error) {
        console.error('Failed to fetch details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleFoodClick = (food: Food) => {
    if (!food.isAvailable || food.currentQuantity === 0) return;
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  const handleAddToCart = (quantity: number, toppings: Topping[]) => {
    if (selectedFood && restaurant) {
      addItem({
        foodId: selectedFood.id,
        name: selectedFood.name,
        price: selectedFood.price,
        imageUrl: selectedFood.imageUrl,
        quantity,
        toppings,
        restaurantId: restaurant.id,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-62.5 bg-slate-200 animate-pulse rounded-4xl mb-8" />
          <div className="flex gap-8">
            <div className="w-64 h-96 bg-slate-200 animate-pulse rounded-xl hidden lg:block" />
            <div className="flex-1 h-screen bg-slate-200 animate-pulse rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-600 mb-4">
            Không tìm thấy thông tin nhà hàng
          </h2>
          <button
            onClick={() => navigate('/app/restaurants')}
            className="text-primary font-medium hover:underline"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16 md:pt-20 pb-24">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        {/* Restaurant Header Info */}
        <RestaurantInfo restaurant={restaurant} />

        {/* Menu Section */}
        <RestaurantMenu categories={categories} foods={menu} onFoodClick={handleFoodClick} />

        {/* Customer Reviews Section */}
        <RestaurantReviewsSection restaurantId={restaurant.id} />
      </div>

      <ToppingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        food={selectedFood}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};
