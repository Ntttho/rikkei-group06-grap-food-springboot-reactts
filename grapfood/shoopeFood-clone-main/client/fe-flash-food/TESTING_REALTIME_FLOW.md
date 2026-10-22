# 🚀 Hướng Dẫn Kiểm Thử Luồng Đặt Hàng Realtime (End-to-End)

Tài liệu này hướng dẫn chi tiết cách kiểm thử luồng Đặt hàng theo thời gian thực (Realtime) mô phỏng chính xác cách hệ thống vận hành trong thực tế giữa **Khách Hàng (Customer)**, **Chủ Quán (Merchant)**, và **Tài Xế (Driver)**.

> **Yêu cầu chuẩn bị:**
> Đảm bảo bạn đã mở sẵn **3 Cửa sổ Trình duyệt (Tabs)**. Bạn nên dùng chức năng Ẩn danh (Incognito) hoặc 3 Profile Trình duyệt khác nhau để có thể đăng nhập 3 tài khoản với 3 Role khác nhau cùng một lúc.

---

## 🛠️ Bước 1: Thiết lập 3 Tab Đăng Nhập

### 👨‍💼 Tab 1: Khách Hàng (Customer)

1. Mở đường dẫn: `http://localhost:5173/auth/customer`
2. Tiến hành đăng nhập với số điện thoại Khách hàng (Hoặc tạo tài khoản mới).
3. Đăng nhập thành công, bạn sẽ được điều hướng vào trang chủ `/app`.

### 🏪 Tab 2: Chủ Quán (Merchant)

1. Mở đường dẫn: `http://localhost:5173/auth/merchant`
2. Tiến hành đăng nhập với số điện thoại Chủ quán.
3. Điều hướng tới màn hình **Quản lý Đơn hàng (Kanban Board)** tại `/merchant/orders`.
4. (Lúc này bảng Kanban có thể đang trống nếu chưa có đơn nào).

### 🛵 Tab 3: Tài Xế (Driver)

1. Mở đường dẫn: `http://localhost:5173/auth/driver`
2. Tiến hành đăng nhập với số điện thoại Tài xế.
3. Điều hướng tới màn hình **Dashboard** tại `/driver/dashboard`.
4. Bạn sẽ thấy màn hình nhấp nháy dòng chữ **"Đang quét đơn hàng gần bạn... 📡"**.

---

## 🎬 Bước 2: Kích hoạt Luồng Realtime

Bây giờ hãy sắp xếp 3 Tab sao cho bạn có thể nhìn thấy cả 3 cùng một lúc trên màn hình, sau đó làm theo các bước sau:

### 1. Khách Hàng Đặt Món (Tại Tab 1)

- Ở trang chủ `/app`, bấm vào một nhà hàng bất kỳ (Lưu ý: Bạn phải nhớ xem nhà hàng này thuộc về tài khoản Merchant nào ở Tab 2).
- Chọn món ăn và nhấn **Thêm vào giỏ**.
- Mở Giỏ hàng (Góc trên bên phải) và chọn **Thanh toán**.
- Tại trang Checkout, kiểm tra địa chỉ và ấn **Đặt đơn ngay** (Chọn thanh toán Tiền mặt).
- Khách hàng sẽ được chuyển sang màn hình **Tracking Đơn hàng** (Đang tìm tài xế...).

### 2. Chủ Quán Nhận Đơn (Nhìn sang Tab 2)

- **⚡ REALTIME TRIGGER 1:** Ngay khi Khách hàng bấm Đặt đơn thành công, ở **Tab 2 (Merchant)**, một thẻ đơn hàng mới sẽ _LẬP TỨC BAY VÀO_ cột **Chờ xác nhận** (Màu vàng) mà bạn không cần phải F5 tải lại trang.
- Chủ quán (Bạn) click vào nút **Nhận đơn & Làm món** trên thẻ đơn hàng đó.
- Thẻ đơn hàng trượt sang cột **Đang chuẩn bị** (Màu xanh dương).

### 3. Hệ Thống Tìm Tài Xế (Nhìn sang Tab 3)

- **⚡ REALTIME TRIGGER 2:** Khoảng 1-2 giây sau khi Chủ quán ấn "Nhận đơn", hệ thống Backend sẽ phát tín hiệu tìm tài xế.
- Ở **Tab 3 (Driver)**, một Modal Pop-up lớn **"CÓ ĐƠN MỚI! 🛵"** sẽ nhảy bổ ra giữa màn hình, kèm theo âm báo (nếu có), hiển thị rõ số tiền thưởng và khoảng cách giao hàng.
- Tài xế (Bạn) nhấn nút **NHẬN CHUYẾN** màu xanh lá.
- Màn hình Driver chuyển sang trạng thái: **"Đang thực hiện chuyến đi..."**.

### 4. Khách Hàng & Chủ Quán Cập Nhật Trạng Thái (Nhìn lại Tab 1 & Tab 2)

- **⚡ REALTIME TRIGGER 3:** Ngay khi Tài xế ấn nhận chuyến:
  - **Tại Tab 1 (Khách hàng):** Trạng thái Tracking sẽ tự động đổi từ "Đang tìm tài xế" sang "Tài xế đang lấy hàng", đồng thời hiển thị thông tin tài xế và chiếc xe máy trên bản đồ.
  - **Tại Tab 2 (Chủ quán):** Thẻ đơn hàng trong cột Đang chuẩn bị sẽ có thêm thông tin tài xế sẽ đến lấy món (Nếu UI có hỗ trợ).

### 5. Hoàn Tất Đơn Hàng (Chủ Quán -> Tài Xế)

- Sau khi bếp làm xong, ở **Tab 2 (Merchant)**, Chủ quán bấm **Xong món**. Thẻ đơn hàng trượt qua cột cuối cùng.
- Ở **Tab 3 (Driver)**, Tài xế mang hàng đến nơi và bấm **Hoàn thành (Demo)**.
- Mọi trạng thái ở cả 3 Tab sẽ cùng lúc chốt hạ ở trạng thái **Đã hoàn thành / Completed**.

---

> **Khắc phục sự cố (Troubleshooting):**
>
> - Nếu bạn ấn Đặt hàng ở Customer mà Tab Merchant không có gì thay đổi, hãy F12 kiểm tra xem ở Frontend phần `useSocket` đã kết nối thành công chưa (Network -> WS).
> - Đảm bảo rằng tài khoản Merchant bạn đăng nhập chính là `ownerId` của Nhà hàng mà Customer vừa đặt món. Nếu không đúng Nhà hàng thì Merchant đó sẽ không nhận được thông báo Socket!
