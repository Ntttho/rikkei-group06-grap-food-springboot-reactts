import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  LogOut,
  Search,
  ShoppingCart,
  MapPin,
  ChevronDown,
  Menu,
  Tag,
  MessageCircle,
} from 'lucide-react';
import { ActiveOrderBanner } from '@/features/order/components';
import { useAuth, useCart } from '@/context';
import { CartDrawer } from '@/components/Cart/CartDrawer';
import { AiAssistant } from '@/components/AiAssistant/AiAssistant';
import { VoucherWalletModal } from '@/components/VoucherWallet/VoucherWalletModal';
import { FloatingChatModal } from '@/components/Chat/FloatingChatModal';

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    clearCart();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-slate-100 transition-all">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex h-16 md:h-20 items-center justify-between gap-4">
            {/* Logo & Location (Left) */}
            <div className="flex items-center gap-6">
              <Link to="/app" className="flex items-center gap-2 group">
                <span className="text-2xl md:text-3xl font-black tracking-tighter text-primary group-hover:opacity-90 transition-opacity">
                  FlashFood
                </span>
              </Link>

              {/* Location Picker (Hidden on small mobile) */}
              <div className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1.5 rounded-full cursor-pointer border border-slate-200">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-slate-700 max-w-37.5 truncate">
                  144 Xuân Thủy, Cầu Giấy
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Global Search Bar (Middle) - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-auto">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  className="w-full bg-slate-100 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-full py-2.5 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all outline-none"
                  placeholder="Tìm món ăn, quán ăn, trà sữa..."
                />
              </div>
            </div>

            {/* Actions (Right) */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Voucher Wallet Button */}
              <button
                className="relative flex items-center gap-1.5 px-3.5 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-full transition-colors font-bold text-sm cursor-pointer border border-rose-100 shadow-xs"
                onClick={() => setIsVoucherModalOpen(true)}
                title="Ví Voucher & Mã giảm giá"
              >
                <Tag className="h-4 w-4" />
                <span className="hidden sm:inline">Ưu đãi</span>
                <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              </button>

              {/* Chat with Restaurant Button */}
              <button
                className="relative flex items-center gap-1.5 px-3 py-2 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-full transition-colors font-bold text-sm shadow-xs cursor-pointer"
                onClick={() => setIsChatModalOpen(true)}
                title="Nhắn tin với quán ăn"
              >
                <MessageCircle className="h-4 w-4 text-primary" />
                <span className="hidden sm:inline">Chat Quán</span>
              </button>

              {/* Cart Button (Mockup style) */}
              <button
                className="relative flex items-center gap-2 px-4 py-2 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-full transition-colors font-bold text-sm shadow-sm cursor-pointer"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="flex items-center justify-center h-5 min-w-5 px-1.5 bg-rose-500 text-white text-[10px] font-black rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Nav Control */}
              <div className="hidden md:flex items-center">
                {user ? (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 rounded-full bg-white px-4 py-2 border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm font-bold text-slate-700">
                        {user?.fullName || user?.name}
                      </span>
                      <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 overflow-hidden">
                        <UserIcon className="h-4 w-4" />
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-full transition-colors"
                      title="Đăng xuất"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {/* Nút Đăng ký (Dropdown) */}
                    <div className="relative group">
                      <button className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-primary transition-colors">
                        Đăng ký
                        <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                      </button>
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 flex flex-col overflow-hidden">
                        <Link
                          to="/register"
                          className="px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-2"
                        >
                          Khách hàng
                        </Link>
                        <Link
                          to="/merchant/register"
                          className="px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-2"
                        >
                          Chủ quán
                        </Link>
                        <Link
                          to="/driver/register"
                          className="px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-2"
                        >
                          Đối tác Tài xế
                        </Link>
                      </div>
                    </div>

                    {/* Nút Đăng nhập (Dropdown) */}
                    <div className="relative group">
                      <button className="flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-rose-700 hover:shadow-lg transition-all">
                        Đăng nhập
                        <ChevronDown className="h-4 w-4 text-white/70" />
                      </button>
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 flex flex-col overflow-hidden">
                        <Link
                          to="/login"
                          className="px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-2"
                        >
                          Khách hàng
                        </Link>
                        <Link
                          to="/merchant/login"
                          className="px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-2"
                        >
                          Chủ quán
                        </Link>
                        <Link
                          to="/driver/login"
                          className="px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-2"
                        >
                          Đối tác Tài xế
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (Shows only on mobile below header) */}
          <div className="lg:hidden pb-4 pt-2">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="w-full bg-slate-100 border-none focus:ring-2 focus:ring-primary rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-500"
                placeholder="Tìm món ăn..."
              />
            </div>
          </div>
        </div>
      </header>

      <ActiveOrderBanner />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-50/50">
        <Outlet />
      </main>

      {/* Modern App Footer */}
      <footer className="bg-white border-t border-slate-200 pt-12 pb-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="inline-block mb-4">
                <span className="text-2xl font-black tracking-tighter text-slate-900">
                  Flash<span className="text-primary">Food</span>
                </span>
              </Link>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                Đặt món trực tuyến giao hàng siêu tốc. Thưởng thức hàng ngàn món ngon từ các nhà
                hàng yêu thích của bạn.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">
                Về FlashFood
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-slate-500 hover:text-primary text-sm font-medium transition-colors"
                  >
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-500 hover:text-primary text-sm font-medium transition-colors"
                  >
                    Tuyển dụng
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-500 hover:text-primary text-sm font-medium transition-colors"
                  >
                    Quy chế hoạt động
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">
                Hợp tác
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/merchant/login"
                    className="text-slate-500 hover:text-primary text-sm font-medium transition-colors"
                  >
                    Đăng ký quán
                  </Link>
                </li>
                <li>
                  <Link
                    to="/driver/login"
                    className="text-slate-500 hover:text-primary text-sm font-medium transition-colors"
                  >
                    Đăng ký tài xế
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/login"
                    className="text-slate-500 hover:text-primary text-sm font-medium transition-colors"
                  >
                    Hệ thống quản trị
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">
                Liên hệ
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:support@flashfood.vn"
                    className="text-slate-500 hover:text-primary text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    Email: support@flashfood.vn
                  </a>
                </li>
                <li>
                  <a
                    href="tel:19001234"
                    className="text-slate-500 hover:text-primary text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    Hotline: 1900 1234
                  </a>
                </li>
                <li>
                  <span className="text-slate-500 text-sm font-medium block">
                    123 Cầu Giấy, Hà Nội, Việt Nam
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-semibold text-slate-400">
              © {new Date().getFullYear()} FlashFood Inc. Đã đăng ký bản quyền.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Chính sách bảo mật
              </a>
              <a
                href="#"
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Điều khoản sử dụng
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive AI Assistant & Voucher Wallet & Chat */}
      <AiAssistant />
      <VoucherWalletModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
      />
      <FloatingChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
      />
    </div>
  );
};
