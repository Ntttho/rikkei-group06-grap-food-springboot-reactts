# GrabFood Spring Boot Backend

Dự án Backend xây dựng bằng **Spring Boot 3.x** và **Java 21 LTS**, thay thế toàn diện cho `grab-food-monolith` (Node.js/Express) với chất lượng kỹ thuật cao cấp, chuẩn kiến trúc phân tầng (Layered Clean Architecture), bảo mật chặt chẽ, tối ưu hiệu năng và tương thích 100% với dữ liệu và frontend hiện có.

---

## 1. Tech Stack & Công nghệ
- **Ngôn ngữ:** Java 21 LTS
- **Framework:** Spring Boot 3.3.5
- **Bảo mật & Xác thực:** Spring Security 6, Stateless JWT (JSON Web Token), Custom Password Encoder (tương thích cả BCrypt, legacy Scrypt của Node.js và mật khẩu demo plaintext)
- **ORM & CSDL:** Spring Data JPA, Hibernate, MySQL 8+
- **Validation:** Jakarta Bean Validation (`@Valid`, `@NotNull`, `@NotBlank`, `@Size`,...)
- **Tài liệu API:** Springdoc OpenAPI 3 / Swagger UI (`/swagger-ui.html`)
- **Kiểm thử tự động:** JUnit 5, Mockito, AssertJ
- **Build Tool:** Maven với Maven Wrapper (`mvnw`, `mvnw.cmd`)

---

## 2. Kiến trúc thư mục dự án
```
grab-food-springboot/
├── pom.xml                                  # Cấu hình Maven dependencies & plugins
├── mvnw / mvnw.cmd / .mvn                   # Maven Wrapper (chạy ngay không cần cài Maven toàn cục)
└── src/
    ├── main/
    │   ├── java/com/grabfood/
    │   │   ├── config/                      # SecurityConfig (CORS, CSRF, JWT Filter), WebMvcConfig
    │   │   ├── controller/                  # REST Controllers: Auth, Restaurant, Order, Food, Driver,...
    │   │   ├── dto/                         # DTO Request/Response, ApiResponse<T>
    │   │   ├── entity/                      # 23 JPA Entities tương ứng 100% với database MySQL
    │   │   ├── exception/                   # GlobalExceptionHandler, AppException, ResourceNotFoundException
    │   │   ├── repository/                  # Spring Data JPA Repositories
    │   │   ├── security/                    # JwtUtil, CustomUserDetails, CustomPasswordEncoder
    │   │   ├── service/                     # Service Interfaces
    │   │   │   └── impl/                    # Business Logic Service Implementations (ACID Transaction)
    │   │   └── GrabFoodApplication.java     # Main Spring Boot Application
    │   └── resources/
    │       └── application.yml              # Cấu hình port 3000, MySQL database, JWT secret
    └── test/java/com/grabfood/              # Automated Unit Tests (AuthServiceTest, OrderServiceTest)
```

---

## 3. Tương thích Database & Bảng dữ liệu
Hệ thống sử dụng trực tiếp cơ sở dữ liệu `grabfood_db` (từ file `seed data du lieu chinh.sql` / `seed_all.sql`), không thay đổi cấu trúc bảng:
- **Người dùng & Phân quyền:** `roles`, `users`, `user_roles`, `driver_details`, `merchant_details`
- **Quán ăn & Thực đơn:** `restaurants`, `categories`, `food_items`, `toppings`, `food_toppings`
- **Đơn hàng & Topping:** `order_statuses`, `orders`, `order_items`, `order_item_toppings`, `order_status_logs`
- **Thanh toán:** `payments`, `payment_transactions`
- **Tài xế & Định vị:** `driver_locations`, `driver_offers`, `driver_penalties`
- **Khác:** `vouchers`, `system_settings`, `reviews`, `user_addresses`, `restaurant_change_requests`

---

## 4. Hướng dẫn khởi chạy

### Yêu cầu môi trường
- **Java 21** trở lên (`java -version`)
- MySQL Server đang chạy trên cổng `3306` với cơ sở dữ liệu `grabfood_db`.

### Lệnh chạy Backend
Mở terminal tại thư mục `grab-food-springboot`:

```powershell
# Chạy trực tiếp qua Maven Wrapper
.\mvnw.cmd spring-boot:run
```

Hoặc biên dịch ra file JAR:
```powershell
.\mvnw.cmd clean package -DskipTests
java -jar target/grab-food-springboot-1.0.0.jar
```

### Chạy kiểm thử tự động (Unit Test)
```powershell
.\mvnw.cmd test
```

---

## 5. Cổng dịch vụ & Tương thích Frontend
- **Backend URL:** `http://localhost:3000` (được cấu hình mặc định port `3000` để thay thế ngay lập tức `grab-food-monolith` mà không cần sửa cấu hình `apiBase` của Frontend).
- **Swagger UI:** `http://localhost:3000/swagger-ui.html`
- **OpenAPI JSON:** `http://localhost:3000/v3/api-docs`
