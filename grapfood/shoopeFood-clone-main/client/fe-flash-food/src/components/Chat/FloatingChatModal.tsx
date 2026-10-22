import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Store } from 'lucide-react';
import { chatApi, ChatMessage } from '@/services/api/chat';
import { useAuth } from '@/context';

interface FloatingChatModalProps {
  shopId?: number;
  shopName?: string;
  orderId?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const FloatingChatModal: React.FC<FloatingChatModalProps> = ({
  shopId = 1,
  shopName = 'Quán Ăn',
  orderId,
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const data = await chatApi.getMessagesByShop(shopId, orderId);
      setMessages(data || []);
    } catch (err) {
      console.error('Failed to load chat messages:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isOpen, shopId, orderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || sending) return;

    const text = inputValue.trim();
    setInputValue('');
    setSending(true);

    try {
      const newMsg = await chatApi.sendMessage({
        shopId,
        orderId,
        message: text,
      });
      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-6 z-50 w-92 md:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          style={{ height: '500px' }}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-rose-600 to-rose-500 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight truncate max-w-48">{shopName}</h3>
                <span className="text-[11px] text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {orderId ? `Đơn hàng #${orderId}` : 'Hỗ trợ trực tuyến'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-6">
                <MessageCircle className="w-10 h-10 mb-2 text-slate-300" />
                <p className="font-semibold text-slate-600 mb-1">Bắt đầu trò chuyện với quán</p>
                <p>Bạn có thể hỏi về ghi chú món ăn, đổi món hoặc yêu cầu giao hàng đặc biệt.</p>
              </div>
            ) : (
              messages.map((m) => {
                const isMe = String(m.senderId) === String(user?.id);
                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs shrink-0">
                        <Store className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-primary text-white rounded-br-xs'
                          : 'bg-white border border-slate-100 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      {!isMe && (
                        <p className="text-[10px] font-bold text-slate-400 mb-0.5">{m.senderName}</p>
                      )}
                      <p>{m.message}</p>
                      <span
                        className={`text-[9px] block text-right mt-1 ${
                          isMe ? 'text-white/70' : 'text-slate-400'
                        }`}
                      >
                        {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhắn tin cho quán..."
              className="flex-1 px-4 py-2 bg-slate-100 text-xs rounded-full border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || sending}
              className="p-2 rounded-full bg-primary text-white hover:bg-rose-700 transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
