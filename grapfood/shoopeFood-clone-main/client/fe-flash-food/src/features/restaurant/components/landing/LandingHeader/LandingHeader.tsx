import React from 'react';
import { Link } from 'react-router-dom';

export const LandingHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-xs h-20 flex items-center border-b border-slate-100">
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-3xl font-black text-primary tracking-tight group-hover:opacity-90 transition-opacity">
            FlashFood
          </span>
        </Link>

        {/* Single Right Action */}
        <Link
          to="/app"
          className="rounded-full px-6 py-2.5 bg-primary text-white font-bold hover:bg-primary/90 hover:shadow-md transition-all active:scale-95 text-sm"
        >
          Khám phá ngay
        </Link>
      </div>
    </header>
  );
};
