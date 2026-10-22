import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { Food, Topping } from '@/types';

interface ToppingModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: Food | null;
  onAddToCart: (quantity: number, selectedToppings: Topping[]) => void;
}

export const ToppingModal: React.FC<ToppingModalProps> = ({
  isOpen,
  onClose,
  food,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedToppings([]);
    }
  }, [isOpen, food]);

  if (!isOpen || !food) return null;

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings((prev) =>
      prev.some((t) => t.id === topping.id)
        ? prev.filter((t) => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  const toppingsPrice = selectedToppings.reduce((sum, t) => sum + Number(t.price), 0);
  const totalPrice = (Number(food.price) + toppingsPrice) * quantity;

  // Mock toppings if API doesn't provide them yet
  const availableToppings: Topping[] = food.toppings || [
    { id: 1, name: 'Thêm trân châu đen', price: 5000 },
    { id: 2, name: 'Thêm thạch đào', price: 7000 },
    { id: 3, name: 'Nhiều đá', price: 0 },
    { id: 4, name: 'Ít đá', price: 0 },
  ];

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Image */}
          <div className="relative h-48 bg-rose-50 flex items-center justify-center">
            {food.imageUrl ? (
              <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-rose-300">
                <ShoppingBag className="w-12 h-12" />
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <h3 className="text-2xl font-black text-slate-900 mb-2">{food.name}</h3>
            <p className="text-primary font-bold text-lg mb-6">{formatCurrency(food.price)}</p>

            {/* Toppings */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <h4 className="font-bold text-slate-800">Thêm Topping</h4>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                  Tùy chọn
                </span>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
                {availableToppings.map((topping) => {
                  const isSelected = selectedToppings.some((t) => t.id === topping.id);
                  return (
                    <div
                      key={topping.id}
                      onClick={() => toggleTopping(topping)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-rose-50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center border ${
                            isSelected ? 'bg-primary border-primary' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3.5 h-3.5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`font-medium ${isSelected ? 'text-primary' : 'text-slate-700'}`}
                        >
                          {topping.name}
                        </span>
                      </div>
                      <span className="font-bold text-slate-500 text-sm">
                        {topping.price > 0 ? `+${formatCurrency(topping.price)}` : 'Miễn phí'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors shadow-sm"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  onAddToCart(quantity, selectedToppings);
                  onClose();
                }}
                className="flex-1 py-3.5 bg-primary hover:bg-primary-hover text-white font-black rounded-xl shadow-[0_4px_20px_rgba(225,29,72,0.3)] hover:shadow-[0_6px_25px_rgba(225,29,72,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Thêm {formatCurrency(totalPrice)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
