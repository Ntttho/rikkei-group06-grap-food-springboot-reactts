import React from 'react';
import { Zap } from 'lucide-react';

export interface PageLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  message = 'Đang tải dữ liệu...',
  fullScreen = true,
}) => {
  if (!fullScreen) {
    return (
      <div
        className="flex flex-col items-center justify-center p-12 w-full"
        data-testid="page-loading"
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute h-12 w-12 rounded-full border-4 border-slate-100" />
          <div className="absolute h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
        <p className="mt-6 text-sm font-semibold text-slate-500">{message}</p>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-9999 bg-slate-50 flex flex-col pointer-events-none"
      data-testid="page-loading"
    >
      {/* 1. Fake Header (Skeleton) */}
      <header className="w-full h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-slate-200/60 rounded-xl animate-pulse" />
          <div className="h-5 w-24 bg-slate-200/60 rounded-md animate-pulse" />
        </div>
        <div className="h-9 w-28 bg-slate-200/60 rounded-xl animate-pulse" />
      </header>

      {/* 2. Fake Main Content (Skeleton) */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8 overflow-hidden">
        {/* Fake Hero Banner */}
        <div className="w-full h-100 bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.02)] p-8 flex flex-col items-center justify-center space-y-6">
          <div className="h-7 w-64 bg-slate-200/60 rounded-full animate-pulse mb-2" />
          <div className="h-12 md:h-16 w-3/4 max-w-2xl bg-slate-200/60 rounded-2xl animate-pulse" />
          <div className="h-4 w-1/2 max-w-md bg-slate-200/60 rounded-md animate-pulse" />
          <div className="h-16 w-full max-w-2xl bg-slate-100 rounded-full animate-pulse mt-8 border border-slate-200/60" />
        </div>

        {/* Fake Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="h-32 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse" />
          <div className="h-32 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse hidden md:block" />
          <div className="h-32 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse hidden md:block" />
        </div>
      </div>

      {/* 3. Central Premium Spinner Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/30 backdrop-blur-[3px]">
        <div className="flex flex-col items-center bg-white p-8 md:p-10 rounded-4xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100/50 transform scale-100 animate-in zoom-in-95 duration-300">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute h-16 w-16 rounded-full border-4 border-slate-100" />
            <div className="absolute h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <Zap className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <h3 className="text-base font-bold text-slate-800 tracking-wide">{message}</h3>
          <p className="mt-1.5 text-xs font-medium text-slate-400">
            Đang chuẩn bị trải nghiệm tốt nhất...
          </p>
        </div>
      </div>
    </div>
  );
};
