import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Bot,
  X,
  Send,
  Flame,
  Coffee,
  Leaf,
  DollarSign,
  ShoppingCart,
} from 'lucide-react';
import { useCart } from '@/context';
import { formatCurrency } from '@/utils';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  suggestions?: {
    id: number;
    name: string;
    restaurantName: string;
    price: number;
    imageUrl?: string;
    rating: number;
  }[];
}

const QUICK_PROMPTS = [
  { icon: DollarSign, label: 'Bữa trưa < 50k', query: 'Gợi ý bữa trưa ngon bổ rẻ dưới 50.000đ' },
  { icon: Flame, label: 'Món cay nồng', query: 'Tìm món ăn cay kích thích vị giác' },
  { icon: Coffee, label: 'Trà sữa & tráng miệng', query: 'Gợi ý trà sữa topping hoặc tráng miệng' },
  { icon: Leaf, label: 'Món healthy / Chay', query: 'Gợi ý món ăn thanh đạm, ít calo' },
];

export const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { addItem } = useCart();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Xin chào! Tôi là **AI Trợ Lý Ẩm Thực FlashFood** ⚡. Hôm nay bạn đang thèm món gì? Hãy cho tôi biết khẩu vị hoặc ngân sách của bạn nhé!',
      timestamp: new Date(),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (userText: string) => {
    const query = userText.trim();
    if (!query) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      generateAiResponse(query);
      setIsTyping(false);
    }, 900);
  };

  const generateAiResponse = (query: string) => {
    const lower = query.toLowerCase();
    let replyText = '';
    let suggestions: Message['suggestions'] = [];

    if (lower.includes('50k') || lower.includes('rẻ') || lower.includes('tiết kiệm') || lower.includes('trưa')) {
      replyText = 'Dưới đây là các món ăn trưa no bụng, giá cực kỳ hợp lý dưới 50k được khách hàng đánh giá 5 sao hôm nay:';
      suggestions = [
        {
          id: 1,
          name: 'Cơm Tấm Sườn Nướng Mật Ong',
          restaurantName: 'Cơm Tấm Cali Sài Gòn',
          price: 45000,
          imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop',
          rating: 4.9,
        },
        {
          id: 2,
          name: 'Bún Chả Hà Nội Truyền Thống',
          restaurantName: 'Bún Chả Hương Quê',
          price: 40000,
          imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop',
          rating: 4.8,
        },
      ];
    } else if (lower.includes('cay') || lower.includes('lẩu') || lower.includes('mì')) {
      replyText = 'Hôm nay trời rất hợp với các món cay ấm nồng! Hãy thử ngay các gợi ý đậm đà này nhé:';
      suggestions = [
        {
          id: 3,
          name: 'Mì Cay Hàn Quốc Hải Sản 7 Cấp Độ',
          restaurantName: 'Seoul Spicy Noodle House',
          price: 55000,
          imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop',
          rating: 4.9,
        },
        {
          id: 4,
          name: 'Bún Bò Huế Tái Nạm Sa Tế Cay',
          restaurantName: 'Bún Bò Đông Ba',
          price: 48000,
          imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop',
          rating: 4.95,
        },
      ];
    } else if (lower.includes('trà sữa') || lower.includes('nước') || lower.includes('tráng miệng') || lower.includes('ngọt')) {
      replyText = 'Giải nhiệt và nạp năng lượng ngọt ngào với các siêu phẩm đồ uống thịnh hành nhất:';
      suggestions = [
        {
          id: 5,
          name: 'Trà Sữa Trân Châu Hoàng Gia (Full Topping)',
          restaurantName: 'Gong Cha Official Store',
          price: 38000,
          imageUrl: 'https://images.unsplash.com/photo-1558857563-b37cfb43ec68?w=500&auto=format&fit=crop',
          rating: 5.0,
        },
        {
          id: 6,
          name: 'Trà Đào Cam Sả Tươi Mát',
          restaurantName: 'The Coffee House Hub',
          price: 35000,
          imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop',
          rating: 4.85,
        },
      ];
    } else if (lower.includes('chay') || lower.includes('healthy') || lower.includes('salad') || lower.includes('calo')) {
      replyText = 'Lựa chọn tuyệt vời cho sức khỏe và vóc dáng! Tôi đã chọn lọc những món tươi ngon, giàu chất xơ:';
      suggestions = [
        {
          id: 7,
          name: 'Salad Ức Gà Áp Chảo Sốt Mè Rang',
          restaurantName: 'Healthy & Green Fit Kitchen',
          price: 52000,
          imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop',
          rating: 4.9,
        },
      ];
    } else {
      replyText = `Tôi đã tìm kiếm các quán ăn nổi bật theo yêu cầu "${query}". Hãy tham khảo các món ngon dưới đây hoặc thử chọn các danh mục nhanh nhé:`;
      suggestions = [
        {
          id: 1,
          name: 'Cơm Tấm Sườn Nướng Mật Ong',
          restaurantName: 'Cơm Tấm Cali Sài Gòn',
          price: 45000,
          imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop',
          rating: 4.9,
        },
        {
          id: 5,
          name: 'Trà Sữa Trân Châu Hoàng Gia',
          restaurantName: 'Gong Cha Official Store',
          price: 38000,
          imageUrl: 'https://images.unsplash.com/photo-1558857563-b37cfb43ec68?w=500&auto=format&fit=crop',
          rating: 5.0,
        },
      ];
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: replyText,
      timestamp: new Date(),
      suggestions,
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  const handleAddToCart = (s: NonNullable<Message['suggestions']>[0]) => {
    addItem({
      foodId: s.id,
      name: s.name,
      price: s.price,
      quantity: 1,
      imageUrl: s.imageUrl,
      toppings: [],
      restaurantId: 1,
    });
    toast.success(`Đã thêm "${s.name}" vào giỏ hàng!`);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-rose-500/30 transition-all font-bold text-sm tracking-wide cursor-pointer border-2 border-white/40"
      >
        <div className="relative">
          <Sparkles className="h-5 w-5 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>
        </div>
        <span className="hidden sm:inline">AI Trợ Lý Ẩm Thực</span>
      </motion.button>

      {/* Chat Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-22 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[80vh] bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    FlashFood AI Assistant
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">Hỏi đáp & Tìm kiếm món ăn thông minh</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="h-7 w-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      AI
                    </div>
                  )}

                  <div className="max-w-[85%] space-y-2.5">
                    <div
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-rose-600 text-white rounded-br-none shadow-md shadow-rose-600/20'
                          : 'bg-white text-slate-800 rounded-bl-none border border-slate-200/80 shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>
                    </div>

                    {/* Interactive Recommendations */}
                    {m.suggestions && m.suggestions.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {m.suggestions.map((s) => (
                          <div
                            key={s.id}
                            className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center gap-3 shadow-xs hover:border-rose-300 transition-colors"
                          >
                            {s.imageUrl && (
                              <img
                                src={s.imageUrl}
                                alt={s.name}
                                className="h-14 w-14 rounded-lg object-cover shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-800 truncate">{s.name}</h4>
                              <p className="text-[11px] text-slate-500 truncate">{s.restaurantName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-black text-rose-600">{formatCurrency(s.price)}</span>
                                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                  ★ {s.rating}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleAddToCart(s)}
                              className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                              title="Thêm vào giỏ"
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                  <Bot className="h-4 w-4 animate-spin text-rose-500" />
                  <span>FlashFood AI đang tìm kiếm món ngon phù hợp...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_PROMPTS.map((p, idx) => {
                const IconComponent = p.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(p.query)}
                    className="shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-rose-50 hover:text-rose-600 rounded-full transition-colors text-slate-600 border border-slate-200 cursor-pointer"
                  >
                    <IconComponent className="h-3 w-3" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập món bạn thích hoặc mức giá..."
                className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="h-9 w-9 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
