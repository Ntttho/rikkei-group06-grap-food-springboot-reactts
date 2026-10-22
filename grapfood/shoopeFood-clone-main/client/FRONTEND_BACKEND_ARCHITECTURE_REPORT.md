# 📑 BÁO CÁO TỔNG QUAN KIẾN TRÚC FRONTEND - BACKEND & QUY CHUẨN THIẾT KẾ THỰC TẾ DOANH NGHIỆP

> **Dự án**: ShopeeFood / GrabFood Fullstack Monolith & Client  
> **Tài liệu**: Tổng hợp Giao diện Frontend, Danh mục API Backend, Thư viện phụ thuộc & Bộ Quy chuẩn ReactJS + TypeScript Production Standard  
> **Ngày lập**: 29/07/2026  

---

## 🏛️ PHẦN 1: BÁO CÁO CHI TIẾT GIAO DIỆN FRONTEND HIỆN CÓ (`fe_fegrapfood`)

Hiện tại, thư mục Frontend `fe_fegrapfood` gồm **17 trang giao diện chính** chia theo 4 phân hệ người dùng chính (Khách hàng, Chủ quán, Tài xế, Quản trị viên):

### 1. Phân hệ Khách hàng (Customer Experience)
* 🏠 **`HomePage.tsx` (Trang chủ)**: 
  - *Công dụng*: Màn hình chính tiếp đón người dùng. Hiển thị Banner khuyến mãi, Bộ lọc danh mục món ăn (Cơm, Bún, Trà sữa...), danh sách Quán ngon gần bạn, quán đánh giá cao, và thanh tìm kiếm nhanh.
* 🔍 **`BrowseRestaurantsPage.tsx` (Trang xem & Tìm kiếm Nhà hàng)**: 
  - *Công dụng*: Cho phép khách hàng duyệt danh sách nhà hàng theo từ khóa, danh mục món ăn, bộ lọc trạng thái mở cửa (`isOpen`), hoặc sắp xếp theo đánh giá `ratingAvg`.
* 🍜 **`RestaurantDetailPage.tsx` (Trang Chi tiết Nhà hàng & Thực đơn)**: 
  - *Công dụng*: Trình bày thực đơn món ăn của từng quán, chọn kích cỡ/topping đi kèm, chọn số lượng, áp dụng Voucher giảm giá và thêm món vào Giỏ hàng.
* 💳 **`PaymentPage.tsx` (Trang Thanh toán & Xác nhận đơn)**: 
  - *Công dụng*: Xem lại chi tiết đơn hàng, nhập địa chỉ giao hàng, tính phí vận chuyển (`shippingFee`), áp mã giảm giá và chọn phương thức thanh toán (Tiền mặt COD, Ví điện tử, Chuyển khoản QR).
* 📱 **`QrPaymentPage.tsx` & `MockPaymentGatewayPage.tsx` (Trang Thanh toán QR & Cổng giả lập)**: 
  - *Công dụng*: Hiển thị mã QR Code chuyển khoản hoặc cổng giả lập thanh toán ngân hàng cho các đơn hàng trả trước.
* 📍 **`TrackingPage.tsx` (Trang Theo dõi Đơn hàng Realtime)**: 
  - *Công dụng*: Tích hợp bản đồ trực quan (Leaflet/OSRM) theo dõi tiến trình giao hàng theo thời gian thực (Tài xế nhận đơn ➔ Đến quán ➔ Lấy món ➔ Đang giao ➔ Khách nhận hàng) qua kênh WebSocket Socket.io.
* 👤 **`ProfilePage.tsx` (Trang Hồ sơ Cá nhân)**: 
  - *Công dụng*: Xem/sửa thông tin cá nhân, danh sách địa chỉ đã lưu, lịch sử đơn hàng đã đặt và đánh giá chất lượng món ăn (`Review`).

---

### 2. Phân hệ Chủ Quán (Merchant Portal)
* 🏬 **`RestaurantListPage.tsx` (Danh sách Quán ăn của Chủ quán)**: 
  - *Công dụng*: Quản lý danh sách các quán ăn/chi nhánh mà tài khoản Chủ quán đang sở hữu.
* 📝 **`RestaurantFormPage.tsx` (Trang Đăng ký / Chỉnh sửa Quán)**: 
  - *Công dụng*: Form tạo mới quán ăn (chờ Admin duyệt) hoặc yêu cầu chỉnh sửa thông tin quán (Tên, Địa chỉ, Tọa độ GPS, Giờ mở/đóng cửa, Hình ảnh).
* 📋 **`MerchantMenuPage.tsx` (Quản lý Thực đơn & Topping)**: 
  - *Công dụng*: Cho phép chủ quán Thêm/Sửa/Xóa các món ăn (`Food`), Danh mục món (`Category`), và danh sách Topping kèm giá tiền.
* 📦 **`MerchantOrdersPage.tsx` (Quản lý Đơn hàng đến)**: 
  - *Công dụng*: Tiếp nhận thông báo đơn hàng mới từ Khách hàng realtime, bấm xác nhận chuẩn bị món hoặc hủy đơn nếu hết món.

---

### 3. Phân hệ Tài Xế (Driver App)
* 🛵 **`DriverPage.tsx` (Màn hình Làm việc Tài xế)**: 
  - *Công dụng*: Bật/Tắt trạng thái sẵn sàng nhận đơn, xem Feed đơn hàng xung quanh bán kính GPS, bấm Nhận đơn (`Accept Order`), Cập nhật tiến độ (Đã lấy hàng, Đang giao), và Stream tọa độ GPS thời gian thực về Server.

---

### 4. Phân hệ Quản Trị Viên (Admin Dashboard)
* 🛡️ **`AdminPage.tsx` (Trung tâm Quản trị)**: 
  - *Công dụng*: Thống kê toàn hệ thống, duyệt yêu cầu mở quán của Chủ quán (`PENDING` ➔ `APPROVED`), duyệt yêu cầu chỉnh sửa quán, quản lý tài khoản người dùng và giám sát luồng đơn hàng.

---

### 5. Khung Điều Hướng & Xác Thực
* 🔑 **`LoginPage.tsx` & `RegisterPage.tsx`**: Đăng nhập/Đăng ký tài khoản chọn vai trò (`CUSTOMER`, `MERCHANT`, `DRIVER`, `ADMIN`).
* 🚪 **`PortalPage.tsx`**: Màn hình điều hướng chọn phân hệ làm việc nhanh.

---

## 📦 PHẦN 2: THƯ VIỆN FRONTEND ĐANG SỬ DỤNG (`fe_fegrapfood`)

| Thư viện | Phiên bản | Vai trò & Công dụng trong dự án |
| :--- | :---: | :--- |
| **React** | `^19.2.4` | Core UI Framework dựng component |
| **TypeScript** | `~5.9.3` | Ép kiểu dữ liệu tĩnh, ngăn ngừa lỗi Runtime Javascript |
| **Vite** | `^8.0.1` | Build tool siêu tốc cho React SPA |
| **React Router DOM** | `^7.9.5` | Điều hướng trang client-side (SPA Routing) |
| **Axios** | `^1.13.2` | HTTP Client gọi REST API tới Backend Express |
| **Socket.io-client**| `^4.8.3` | Kết nối WebSocket thời gian thực (Tracking đơn & GPS) |
| **Leaflet & React-Leaflet** | `^1.9.4` | Hiển thị bản đồ vị trí quán, tài xế và vẽ đường đi |
| **TailwindCSS** | `^4.3.1` | Utility-first CSS Framework dựng giao diện |
| **@refinedev/core** | `^5.0.12` | Framework bổ trợ quản lý CRUD data provider |

---

## ⚙️ PHẦN 3: DANH MỤC BACKEND API HIỆN CÓ (`grab-food-monolith`)

Backend được thiết kế theo chuẩn RESTful API phục vụ 14 nhóm chức năng cốt lõi:

| Nhóm API Module | Endpoint Path | Phương thức | Mô tả Chức năng |
| :--- | :--- | :---: | :--- |
| **Auth** | `/api/auth/login` | `POST` | Đăng nhập tài khoản, trả về JWT Token |
| | `/api/auth/register` | `POST` | Đăng ký tài khoản mới (Customer/Merchant) |
| | `/api/auth/me` | `GET` | Lấy thông tin tài khoản hiện tại |
| **Restaurants** | `/api/restaurants` | `GET / POST` | Xem danh sách quán ăn approved / Tạo quán mới |
| | `/api/restaurants/:id` | `GET / PUT / DELETE` | Chi tiết quán / Sửa thông tin quán / Xóa quán |
| **Foods** | `/api/foods` | `GET / POST` | Danh sách món ăn / Tạo món ăn mới cho quán |
| | `/api/foods/:id` | `PUT / DELETE` | Chỉnh sửa / Xóa món ăn |
| **Categories** | `/api/categories` | `GET / POST` | Quản lý danh mục món ăn (Cơm, Lẩu, Nước...) |
| **Toppings** | `/api/toppings` | `GET / POST / PUT` | Quản lý danh sách Topping đi kèm món ăn |
| **Orders** | `/api/orders` | `GET / POST` | Xem danh sách đơn hàng / Khách hàng đặt đơn mới |
| | `/api/orders/:id/status` | `PUT` | Cập nhật trạng thái luồng đơn hàng |
| | `/api/orders/:id/accept` | `POST` | Tài xế bấm nhận đơn hàng |
| **Drivers** | `/api/drivers/feed` | `GET` | Feed danh sách đơn hàng khả dụng cho tài xế |
| | `/api/drivers/:id/location`| `POST` | Stream tọa độ GPS thời gian thực của tài xế |
| **Vouchers** | `/api/vouchers` | `GET / POST` | Danh sách & Tạo mã giảm giá |
| **Reviews** | `/api/reviews` | `GET / POST` | Đánh giá sao & bình luận cho đơn hàng |
| **Payments** | `/api/payments` | `POST` | Xử lý giao dịch thanh toán đơn hàng |
| **Admin** | `/api/admin/approval` | `GET / POST` | Trung tâm duyệt quán ăn & duyệt yêu cầu chỉnh sửa |
| **WebSockets** | `order:updated`, `driver:location-updated` | `WS` | Phát sự kiện thời gian thực tới Client & App |

---

## 📐 PHẦN 4: KIẾN TRÚC REACTJS + TYPESCRIPT CHUẨN DOANH NGHIỆP LỚN (PRODUCTION STANDARDS)

Để dự án Frontend mới (**FlashFood**) đạt chuẩn Clean Architecture của các tập đoàn công nghệ thực tế, toàn bộ mã nguồn phải tuân thủ nghiêm ngặt các quy tắc sau:

### 1. TUYỆT ĐỐI CẤM (STRICT PROHIBITIONS)
- ❌ **CẤM dùng `any`**: Tất cả biến, tham số, props, API response phải được định nghĩa `type` hoặc `interface` rõ ràng. Dùng `unknown` nếu chưa xác định.
- ❌ **CẤM dùng `@ts-ignore` / `@ts-expect-error`**: Phải sửa lỗi TypeScript tận gốc.
- ❌ **CẤM dùng `var` / `==`**: Chỉ dùng `const` / `let` và so sánh tuyệt đối `===`.
- ❌ **CẤM dùng inline style**: 100% giao diện dùng TailwindCSS hoặc CSS Modules.
- ❌ **CẤM dùng `index` làm key khi `.map()`**: Bắt buộc dùng Unique ID (`item.id`).
- ❌ **CẤM Component dài quá 200 dòng**: Phải tách nhỏ thành các sub-components đơn nhiệm.
- ❌ **CẤM Mutate State trực tiếp**: Luôn sử dụng Immutable Update pattern.

---

### 2. NAMING CONVENTIONS (QUY TẮC ĐẶT TÊN CHUẨN)
```text
components/FoodCard/FoodCard.tsx         # Component: PascalCase
components/FoodCard/FoodCard.test.tsx    # Test file đi kèm
hooks/useOrderTracking.ts                # Custom Hook: camelCase, prefix "use"
services/restaurantService.ts            # Service: camelCase + Suffix Service
types/restaurant.types.ts                # Types: camelCase + Suffix .types.ts
constants/orderStatus.ts                 # Constants: camelCase
```
* **Variables & Handlers**: `camelCase` (ví dụ: `handleSubmit`, `isLoading`).
* **Booleans**: Prefix `is` / `has` / `can` (ví dụ: `isOpen`, `hasVoucher`, `canCheckout`).
* **Interfaces & Types**: `PascalCase` với Suffix `Props` / `State` / `Response` / `Payload`.

---

### 3. KIẾN TRÚC THƯ MỤC LAYERED FEATURE-BASED (CLEAN ARCHITECTURE)

```text
src/
├── assets/              # Logos, Images, Fonts
├── components/          # Shared Generic UI Components (Button, Modal, Input, Spinner, Card)
├── features/            # Feature-Based Modules (Auth, Restaurant, Order, Driver, Admin)
│   ├── auth/
│   │   ├── components/  # Feature-specific components
│   │   ├── hooks/       # Feature-specific hooks (useLogin, useRegister)
│   │   ├── services/    # authApi.ts
│   │   └── types/       # auth.types.ts
├── context/             # App-wide Global Contexts (AuthContext, CartContext, ThemeContext)
├── hooks/               # Global Custom Hooks (useDebounce, useLocalStorage, useSocket)
├── layouts/             # App Layouts (MainLayout, AuthLayout, DashboardLayout)
├── routes/              # Protected & Public Route definitions
├── services/            # Base Axios Client with JWT Token Interceptors
├── styles/              # Global Design Tokens & Tailwind Base Styles
├── types/               # Common Global DTOs & Domain Models
├── utils/               # Helper functions (formatCurrency, formatDate, validatePhone)
└── test/                # Global Test Setup & MSW Mocks
```

---

### 4. COMPONENT PATTERN CHUẨN MẪU (ENTERPRISE PATTERN)

```typescript
import React, { memo } from 'react';
import { Food } from '@/types/food.types';

export interface FoodCardProps {
  food: Food;
  onAddToCart: (food: Food) => void;
  isAvailable?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = memo(({
  food,
  onAddToCart,
  isAvailable = true,
}) => {
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(food.price);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-md transition-all hover:shadow-xl dark:bg-slate-800">
      <img
        src={food.imageUrl || '/placeholder-food.png'}
        alt={food.name}
        className="h-40 w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
      />
      <div className="mt-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{food.name}</h3>
        <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">{formattedPrice}</p>
      </div>
      <button
        disabled={!isAvailable}
        onClick={() => onAddToCart(food)}
        className="mt-4 w-full rounded-xl bg-emerald-500 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-600 disabled:bg-slate-300"
      >
        {isAvailable ? 'Thêm vào giỏ' : 'Hết món'}
      </button>
    </div>
  );
});

FoodCard.displayName = 'FoodCard';
```

---

### 5. CHUẨN KIỂM THỬ SQA CHO FRONTEND (TESTING STANDARD)
- Sử dụng **Vitest + React Testing Library + MSW (Mock Service Worker)**.
- Mọi Component UI chính phải có file `.test.tsx` đi kèm kiểm tra:
  1. **Render Test**: Component hiển thị đúng dữ liệu Props truyền vào.
  2. **User Interaction Test**: Giả lập sự kiện Click/Type của người dùng.
  3. **Async State Test**: Kiểm tra trạng thái `Loading...`, `Error` và `Success`.

---

## 🎯 PHẦN 5: ĐỀ XUẤT LỘ TRÌNH CHUYỂN ĐỔI SANG FRONTEND MỚI (`FlashFood`)

1. **Bước 1 (Giữ nguyên Backend ổn định)**: Backend Express `grab-food-monolith` trên port `3000` giữ nguyên 100% API sẵn có.
2. **Bước 2 (Khởi tạo `FlashFood` Clean Architecture)**: Khởi tạo dự án mới tại `client/flashfood-frontend` với React 19, TypeScript, Vite & TailwindCSS.
3. **Bước 3 (Triển khai từng Phân hệ & Test Suite)**:
   - Module 1: Auth & User Profile (Login/Register/JWT Storage).
   - Module 2: Customer Flow (Home, Browse, Detail, Cart, Checkout).
   - Module 3: Realtime Order Tracking (Socket.io + Leaflet Map).
   - Module 4: Merchant & Driver Portals.
   - Module 5: Vitest Automated Frontend Test Suite.
