import React, { useEffect, useState } from 'react';
import { getCategories, getRestaurants } from '@/services/api';
import { Category, Restaurant } from '@/types';
import {
  HeroSection,
  AppFeaturesSection,
  HomeCategories,
  RestaurantFeed,
  TestimonialsSection,
  PromoBannerSection,
  NewsBlogSection,
  PartnerPromos,
  ActiveOrderTracker,
} from './home';
import { FlashSaleBanner } from '@/components/FlashSale/FlashSaleBanner';
import { useAuth } from '@/context';

const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Cơm',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&q=80',
  },
  {
    id: 2,
    name: 'Trà Sữa',
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=200&q=80',
  },
  {
    id: 3,
    name: 'Ăn Vặt',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&q=80',
  },
  {
    id: 4,
    name: 'Gà Rán',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&q=80',
  },
  {
    id: 5,
    name: 'Bún/Phở',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&q=80',
  },
  {
    id: 6,
    name: 'Burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80',
  },
  {
    id: 7,
    name: 'Healthy',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80',
  },
  {
    id: 8,
    name: 'Siêu thị',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&q=80',
  },
];

const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    name: 'Cơm Tấm Sài Gòn - Trứ Danh',
    address: '144 Xuân Thủy',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
    ratingAvg: 4.8,
    status: 'OPEN',
    isOpen: true,
    openingTime: '07:00',
    closingTime: '22:00',
    distanceKm: 1.2,
    deliveryTime: '15 phút',
    latitude: 0,
    longitude: 0,
  },
  {
    id: 2,
    name: 'Trà Sữa Koi Thé - Cầu Giấy',
    address: '12 Cầu Giấy',
    imageUrl: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&q=80',
    ratingAvg: 4.9,
    status: 'OPEN',
    isOpen: true,
    openingTime: '07:00',
    closingTime: '22:00',
    distanceKm: 2.5,
    deliveryTime: '20 phút',
    latitude: 0,
    longitude: 0,
  },
  {
    id: 3,
    name: 'Gà Rán KFC - BigC',
    address: 'BigC Thăng Long',
    imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&q=80',
    ratingAvg: 4.5,
    status: 'OPEN',
    isOpen: true,
    openingTime: '07:00',
    closingTime: '22:00',
    distanceKm: 3.1,
    deliveryTime: '25 phút',
    latitude: 0,
    longitude: 0,
  },
  {
    id: 4,
    name: 'Phở Lý Quốc Sư',
    address: '10 Hoàng Minh Giám',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
    ratingAvg: 4.7,
    status: 'OPEN',
    isOpen: true,
    openingTime: '07:00',
    closingTime: '22:00',
    distanceKm: 0.8,
    deliveryTime: '10 phút',
    latitude: 0,
    longitude: 0,
  },
];

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const isCustomer = isAuthenticated && user?.role.toUpperCase() === 'CUSTOMER';

  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catData, resData] = await Promise.all([
          getCategories().catch(() => null),
          getRestaurants().catch(() => null),
        ]);

        setCategories(catData && catData.length > 0 ? catData : MOCK_CATEGORIES);
        setRestaurants(
          resData && resData.items && resData.items.length > 0 ? resData.items : MOCK_RESTAURANTS
        );
      } catch {
        setCategories(MOCK_CATEGORIES);
        setRestaurants(MOCK_RESTAURANTS);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-12 py-6 max-w-350 mx-auto">
      {isCustomer ? (
        <>
          <ActiveOrderTracker />
          <FlashSaleBanner />
          <PromoBannerSection />
        </>
      ) : (
        <>
          {/* Hero Section */}
          <HeroSection />

          {/* Flash Sale Countdown Live */}
          <FlashSaleBanner />

          {/* App Features Section */}
          <AppFeaturesSection />

          {/* Special Promo Banner - Moved up for better conversion */}
          <PromoBannerSection />
        </>
      )}

      {/* Categories & Restaurant Feed */}
      <HomeCategories categories={categories} />
      <RestaurantFeed restaurants={restaurants} />

      {!isCustomer && (
        <>
          {/* Testimonials Section */}
          <TestimonialsSection />

          {/* News & Blogs Section */}
          <NewsBlogSection />

          {/* Partner Banners */}
          <PartnerPromos />
        </>
      )}
    </div>
  );
};
