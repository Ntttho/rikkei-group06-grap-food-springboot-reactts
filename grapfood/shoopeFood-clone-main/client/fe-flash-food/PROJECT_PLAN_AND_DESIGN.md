# 🚀 FLASHFOOD: TÀI LIỆU QUY HOẠCH GIAO DIỆN & KẾ HOẠCH PHÁT TRIỂN (PHASE PLANNING)

Tài liệu này định nghĩa Hệ thống Thiết kế (Design System) và Lộ trình chi tiết từng Phase để hoàn thiện toàn bộ các giao diện còn thiếu của dự án `fe-flash-food` so với dự án legacy `fe_fegrapfood`.

---

## 🎨 PHẦN 1: HỆ THỐNG THIẾT KẾ (PREMIUM DESIGN SYSTEM)

Để FlashFood mang lại cảm giác **"Sang trọng, Nhanh chóng và Kích thích vị giác"** (Premium & Appetizing), chúng ta sử dụng phổ màu hiện đại kết hợp không gian trắng (White space) rộng rãi và Glassmorphism (Kính mờ) ở các thanh điều hướng.

### 1. Phổ Màu Chủ Đạo (Color Palette)

| Vai trò               | Tên màu           | Mã Hex    | Tailwind Class / Arbitrary      | Ứng dụng thực tế                                                                                                        |
| :-------------------- | :---------------- | :-------- | :------------------------------ | :---------------------------------------------------------------------------------------------------------------------- |
| **Primary (Chủ đạo)** | **Crimson Red**   | `#E11D48` | `bg-primary`, `text-primary`    | Màu nhấn thương hiệu cao cấp. Khơi gợi sự thèm ăn nhưng đầm, sâu và sang trọng hơn cam dạ quang.                        |
| **Primary Hover**     | **Rose Crimson**  | `#BE123C` | `hover:bg-[#BE123C]`            | Trạng thái hover của nút Primary, tạo cảm giác nhấn thực tế và tinh tế.                                                 |
| **Signature Accent**  | **Golden Amber**  | `#D97706` | `text-amber-600`, `bg-amber-50` | Điểm nhấn hoàng gia: Đánh giá Sao (Rating), Huy hiệu Đối tác VIP, Tag Món Bán Chạy. Tương phản tuyệt đẹp với nền trắng. |
| **Success / Fresh**   | **Emerald Green** | `#059669` | `text-emerald-600`              | Trạng thái "Giao thành công", Tag món Chay/Healthy, Trạng thái Quán mở cửa. Mang lại cảm giác tươi sạch, an toàn.       |
| **Background (Nền)**  | **Alabaster**     | `#F9FAFB` | `bg-slate-50`                   | Màu nền tổng thể hơi ngả xám/trắng ngà, giúp mắt người dùng thư giãn khi lướt Menu dài.                                 |
| **Surface (Card)**    | **Pure White**    | `#FFFFFF` | `bg-white`                      | Nền của FoodCard, Modal, Thanh công cụ. Nổi bật trên nền Alabaster qua hiệu ứng shadow mượt mà.                         |
| **Heading Text**      | **Rich Charcoal** | `#0F172A` | `text-slate-900`                | Tiêu đề H1, H2, Tên Món ăn. Đen sâu thẳm, nét chữ gọn gàng mang cảm giác nhà hàng 5 sao.                                |
| **Body Text**         | **Slate Gray**    | `#475569` | `text-slate-600`                | Mô tả nguyên liệu món ăn, địa chỉ phụ. Dễ đọc, không gây chói mắt.                                                      |
| **Border / Line**     | **Soft Cloud**    | `#F1F5F9` | `border-slate-100`              | Đường kẻ chia cắt các section, viền Card siêu mảnh tạo không gian tối giản (Minimalism).                                |

### 2. Nguyên tắc Thiết kế (Design Principles)

- **Rounded Corners**: Sử dụng `rounded-xl` hoặc `rounded-2xl` cho các Card món ăn và Modal để tạo sự mềm mại, thân thiện. Nút bấm dùng `rounded-lg` hoặc `rounded-full`.
- **Soft Shadows**: Không dùng bóng đen quá gắt. Sử dụng `shadow-sm` cho Card tĩnh và `shadow-md hover:shadow-xl transition-shadow` cho Card khi hover.
- **Micro-animations**: Mọi nút bấm và Card phải có `transition-all duration-200` để phản hồi mượt mà khi người dùng di chuột hoặc click (`active:scale-95`).

---

## 📊 PHẦN 2: BÁO CÁO CÁC GIAO DIỆN CÒN THIẾU (GAP ANALYSIS)

Dưới đây là 17 màn hình (Pages) hiện đang vắng mặt tại `fe-flash-food` được ánh xạ vị trí chuẩn theo Clean Architecture.

### Khách Hàng (Customer)

1. ✅ `HomePage.tsx` ➔ `src/features/restaurant/components/HomePage.tsx`
2. ✅ `BrowseRestaurantsPage.tsx` ➔ `src/features/restaurant/components/BrowsePage.tsx`
3. ✅ `RestaurantDetailPage.tsx` ➔ `src/features/restaurant/components/DetailPage.tsx`
4. ✅ `PaymentPage.tsx` ➔ `src/features/order/components/CheckoutPage.tsx`
5. ✅ `QrPaymentPage.tsx` ➔ `src/features/order/components/QrPaymentPage.tsx`
6. ✅ `MockPaymentGatewayPage.tsx` ➔ `src/features/order/components/MockGatewayPage.tsx`
7. ✅ `TrackingPage.tsx` ➔ `src/features/order/components/TrackingPage.tsx`
8. ✅ `ProfilePage.tsx` ➔ `src/features/auth/components/ProfilePage.tsx`

### Chủ Quán (Merchant)

9. ✅ `RestaurantListPage.tsx` ➔ `src/features/restaurant/components/MerchantRestaurantList.tsx`
10. ✅ `RestaurantFormPage.tsx` ➔ `src/features/restaurant/components/store/RestaurantForm.tsx`
11. ✅ `MerchantMenuPage.tsx` ➔ `src/features/restaurant/components/menu/MerchantMenuManager.tsx`
12. ✅ `MerchantOrdersPage.tsx` ➔ `src/features/order/components/MerchantOrderDashboard.tsx`

### Tài Xế & Admin

13. ✅ `DriverPage.tsx` ➔ `src/features/driver/components/DriverDashboard.tsx`
14. 🟡 `AdminPage.tsx` ➔ `src/features/admin/components/AdminDashboard.tsx` (Mới có khung cơ bản)

### Xác Thực (Auth & Nav)

15. ✅ CustomerAuthPages.tsx (Login/Register) ➔ `src/features/auth/components/CustomerAuthPages.tsx`
16. ✅ MerchantAuthPages.tsx (Login/Register) ➔ `src/features/restaurant/components/MerchantAuthPages.tsx`
17. ✅ DriverAuthPages.tsx (Login/Register) ➔ `src/features/driver/components/DriverAuthPages.tsx`
18. ✅ AdminLogin.tsx ➔ `src/features/admin/components/AdminLogin.tsx`
19. ✅ MainLayout Header Role Navigation ➔ `src/layouts/MainLayout.tsx`

---

## 🚀 PHẦN 3: KẾ HOẠCH TRIỂN KHAI CHI TIẾT (PHASE PLANNING)

Để kiểm soát rủi ro và đảm bảo chất lượng, dự án sẽ được code theo 5 Giai đoạn (Phases) tuần tự:

### 🟢 Phase 1: Core Foundation & Authentication (ĐÃ HOÀN THÀNH)

_Xây dựng cánh cửa bước vào ứng dụng._

- **Công việc đã hoàn thành:**
  1. Cấu hình `src/routes/AppRoutes.tsx` (Tạo `PublicRoute` và `ProtectedRoute` cho 4 roles).
  2. Code bộ Auth Pages hoàn chỉnh cho cả 4 Roles: Customer, Merchant, Driver, Admin (dùng React Hook Form + Zod, phone + password).
  3. Hoàn thiện Layouts: `AuthLayout` (với Unsplash Backgrounds động cho từng role) và `MainLayout` (Header Dropdown chuyển role linh hoạt).
  4. Chuẩn hóa API Service Layer (`auth.ts` và `apiClient.ts`).
- **Mục tiêu:** User có thể đăng nhập, đăng ký và điều hướng qua lại giữa 4 Portal an toàn.

### 🟢 Phase 2: Customer Flow (Phễu Khách Hàng) (ĐÃ HOÀN THÀNH)

_Tạo ra luồng mua hàng - Giá trị cốt lõi của FlashFood._

- **Công việc đã hoàn thành:**
  1. Code `HomePage`: Banner slider, Danh mục thức ăn tròn, Danh sách quán ngon `FoodCard`.
  2. Code `BrowsePage`: Thanh tìm kiếm, Bộ lọc nâng cao.
  3. Code `DetailPage`: Thông tin quán, Menu món ăn với phân loại, Modal chọn Topping.
  4. Nâng cấp `CartContext`: Viết logic thêm/bớt món, Drawer hiển thị giỏ hàng trượt từ phải sang.

### 🟢 Phase 3: Checkout, Payment & Realtime Tracking (ĐÃ HOÀN THÀNH)

_Hoàn tất đơn hàng và theo dõi tài xế._

- **Công việc đã hoàn thành:**
  1. Code `CheckoutPage`: Form nhập địa chỉ, Map nhỏ chọn tọa độ, Bill tổng kết.
  2. Code `QrPaymentPage` & `MockGatewayPage`: Xử lý giao diện thanh toán online.
  3. Code `TrackingPage`: Tích hợp Leaflet Map, kết nối `useSocket` để nhận tọa độ xe máy di chuyển realtime trên bản đồ.
  4. Code `ProfilePage`: Hiển thị Hồ sơ cá nhân và Lịch sử đơn hàng, Đánh giá (Review) đơn cũ.

### 🟢 Phase 4: Merchant & Driver Dashboards (HOÀN THÀNH)

_Công cụ cho đối tác kiếm tiền._

- **Chủ quán:**
  - `MerchantOrderDashboard` (Quản lý Đơn mới / Đang làm / Đã giao).
  - `MerchantMenuManager` (Quản lý Danh mục và Món ăn).
  - `RestaurantForm` (Đăng ký/Sửa thông tin Cửa hàng với Leaflet Map).
- **Tài xế:** `DriverDashboard` (Quét radar, nhận đơn, cập nhật trạng thái).

### 🟢 Phase 5: Admin & System Polish (ĐÃ HOÀN THÀNH)

_Giám sát toàn hệ thống._

- **Công việc đã hoàn thành:**
  1. Code `AdminDashboard`: Xây dựng giao diện Tabs quản lý.
  2. Bảng quản lý `Pending Restaurants`: Xem chi tiết quán ăn chờ duyệt và thao tác Approve/Reject.
  3. Bảng quản lý `Change Requests`: Xem chi tiết yêu cầu thay đổi thông tin (Tên, Địa chỉ, Tọa độ) và thao tác Approve/Reject.
  4. Nâng cấp API: `adminApi.ts` và `admin.types.ts`.
  5. Audit toàn bộ UI: Sửa lỗi responsive, đảm bảo 100% không lỗi Linting/TypeScript.

### 🟡 Phase 6: Tối ưu hóa & Tích hợp Cloudinary (KẾ HOẠCH TƯƠNG LAI)

_Nâng cấp trải nghiệm quản lý hình ảnh chuẩn Production._

- **Mục tiêu:** Thay thế việc nhập URL ảnh bằng tính năng Tải ảnh trực tiếp từ thiết bị.
- **Giải pháp Kiến trúc:** Dùng `multer` trên Node.js để nhận file `multipart/form-data` từ Frontend, sau đó đẩy lên Cloudinary qua `cloudinary SDK`. Cuối cùng lưu `secure_url` vào cơ sở dữ liệu.
- **Phạm vi áp dụng:**
  1. Hình ảnh món ăn của Chủ quán.
  2. Logo/Banner Cửa hàng.
  3. Avatar của Người dùng/Tài xế.
