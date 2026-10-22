import React from 'react';
import { Utensils, Coffee, Pizza, Flame, Soup, Sandwich, Salad, ShoppingBag } from 'lucide-react';
import { Category } from '@/types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface CategoryItemProps {
  category: Category;
}

const getCategoryStyles = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('cơm'))
    return {
      shadow: 'shadow-orange-500/20',
      border: 'border-orange-100',
      icon: Utensils,
      color: 'text-orange-500',
    };
  if (lower.includes('trà sữa') || lower.includes('nước') || lower.includes('uống'))
    return {
      shadow: 'shadow-amber-700/20',
      border: 'border-amber-100',
      icon: Coffee,
      color: 'text-amber-600',
    };
  if (lower.includes('vặt') || lower.includes('bánh'))
    return {
      shadow: 'shadow-yellow-500/20',
      border: 'border-yellow-100',
      icon: Pizza,
      color: 'text-yellow-500',
    };
  if (lower.includes('gà') || lower.includes('rán'))
    return {
      shadow: 'shadow-red-500/20',
      border: 'border-red-100',
      icon: Flame,
      color: 'text-red-500',
    };
  if (lower.includes('bún') || lower.includes('phở') || lower.includes('mì'))
    return {
      shadow: 'shadow-orange-600/20',
      border: 'border-orange-100',
      icon: Soup,
      color: 'text-orange-600',
    };
  if (lower.includes('burger') || lower.includes('bánh mì'))
    return {
      shadow: 'shadow-emerald-500/20',
      border: 'border-emerald-100',
      icon: Sandwich,
      color: 'text-emerald-500',
    };
  if (lower.includes('healthy') || lower.includes('chay'))
    return {
      shadow: 'shadow-green-500/20',
      border: 'border-green-100',
      icon: Salad,
      color: 'text-green-500',
    };
  if (lower.includes('siêu thị') || lower.includes('mart'))
    return {
      shadow: 'shadow-blue-500/20',
      border: 'border-blue-100',
      icon: ShoppingBag,
      color: 'text-blue-500',
    };
  return {
    shadow: 'shadow-slate-400/20',
    border: 'border-slate-200',
    icon: Utensils,
    color: 'text-slate-500',
  };
};

export const CategoryItem: React.FC<CategoryItemProps> = ({ category }) => {
  const { shadow, border, icon: Icon, color } = getCategoryStyles(category.name);

  return (
    <Link to={`/app/restaurants?category=${encodeURIComponent(category.name)}`}>
      <motion.div
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center gap-2 cursor-pointer min-w-[80px] md:min-w-[90px] pb-2"
      >
        <div
          className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white border ${border} shadow-sm hover:shadow-md ${shadow} flex items-center justify-center transition-all group`}
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className={`w-5 h-5 md:w-6 md:h-6 ${color}`} strokeWidth={2} />
          </div>
        </div>
        <span className="text-[12px] md:text-[13px] font-bold text-slate-800 text-center max-w-[90px] truncate leading-tight hover:text-primary transition-colors">
          {category.name}
        </span>
      </motion.div>
    </Link>
  );
};
