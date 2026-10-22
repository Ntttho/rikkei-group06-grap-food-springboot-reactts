import React from 'react';
import { Link } from 'react-router-dom';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 pt-16 pb-12">
      <div className="container mx-auto px-6 md:px-12">
        {/* Main Footer Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Intro Column */}
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-black text-primary tracking-tight">
              FlashFood
            </Link>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Nền tảng giao đồ ăn nhanh chóng, tươi ngon và đáng tin cậy hàng đầu cho trải nghiệm ẩm
              thực hoàn hảo.
            </p>
          </div>

          {/* Navigation Column 1 */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm mb-4">Về FlashFood</h4>
            <ul className="space-y-2.5 text-sm text-slate-500 font-medium">
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Tin tức & Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2 */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm mb-4">Dịch vụ</h4>
            <ul className="space-y-2.5 text-sm text-slate-500 font-medium">
              <li>
                <Link to="/app" className="hover:text-primary transition-colors">
                  Đặt món trực tuyến
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Dành cho Nhà hàng
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Dành cho Tài xế
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3 */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm mb-4">Hỗ trợ & Pháp lý</h4>
            <ul className="space-y-2.5 text-sm text-slate-500 font-medium">
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Divider */}
        <div className="pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} FlashFood Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Tiếng Việt (VN)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
