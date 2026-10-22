import React from 'react';
import { useAuth } from '@/context';
import { motion } from 'framer-motion';

export const WelcomeSection: React.FC = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  return (
    <section className="px-4 md:px-8 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between border border-slate-100 shadow-sm"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
            {getGreeting()},{' '}
            <span className="text-primary">{user?.fullName || user?.name || 'bạn'}</span>!{' '}
            <motion.span
              animate={{ rotate: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="inline-block origin-bottom-right"
            >
              👋
            </motion.span>
          </h1>
          <p className="text-slate-500 font-medium text-sm md:text-base">
            Hôm nay bạn muốn thưởng thức món gì?
          </p>
        </div>
      </motion.div>
    </section>
  );
};
