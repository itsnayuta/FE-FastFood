# Bài tập lớn Android - Nhóm học phần 03 - Nhóm BTL 08



## Chủ đề - Xây dựng ứng dụng Android đặt đồ ăn nhanh
Ứng dụng đặt đồ ăn nhanh là một hệ thống hiện đại hỗ trợ người dùng lựa chọn, đặt món và thanh toán trực tuyến thông qua thiết bị di động chạy hệ điều hành Android. Có xác thực tài khoản, hỗ trợ đăng kí, đăng nhập, thanh toán trực tuyến thông qua VNPay.



## Thành viên

| Họ và tên         | Mã sinh viên | Phân công                                                                                                                                                                  |
| ----------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nguyễn Tiến Thành**  | B21DCCN679   | Backend: Quản lý người dùng (đăng ký, đăng nhập, phân quyền, hồ sơ cá nhân). Frontend: Giao diện onboarding, đăng nhập, đăng ký, cập nhật hồ sơ, lịch sử đặt hàng, amdin quản ký user, admin home.                      |
| **Phạm Quang Huy**  | B21DCCN439   | Backend: Quản lý sản phẩm (CRUD sản phẩm, danh mục, combo). Frontend: Hiển thị danh sách sản phẩm, chi tiết sản phẩm, tìm kiếm.                                            |
| **Đào Tùng Lâm** | B21DCCN475   | Backend: Quản lý đơn hàng (tạo đơn, cập nhật trạng thái, lưu lịch sử). Frontend:Giao diện Home , Giao diện Giỏ hàng, Tìm kiếm món ăn, Xử lý logic thêm giỏ hàng                                |
| **Nguyễn Thành Long**  | B21DCCN499   | Backend: Tích hợp thanh toán (MOMO, thẻ ngân hàng), khuyến mãi, báo cáo doanh thu. Frontend: Giao diện thanh toán, nhập mã giảm giá, hiển thị thông tin ưu đãi và voucher. |
                                                                           |




## Các công nghệ áp dụng

- **Công cụ phát triển**:  
  - Android Studio: Debug và giả lập ứng dụng Android  
  - Visual Studio Code: Viết mã React Native  
  - IntelliJ IDEA / Spring Tool Suite: Phát triển backend Spring Boot  

- **Ngôn ngữ lập trình**:  
  - JavaScript (React Native)  
  - Java (Spring Boot)

- **Kiến trúc hệ thống**:  
  - Backend: Kiến trúc 3 lớp (Controller – Service – Repository), RESTful API  
  - Frontend: Component-based, quản lý trạng thái toàn cục bằng Redux hoặc Context API

- **Giao diện người dùng (UI Framework)**:  
  - React Native core + NativeBase hoặc React Native Elements  
  - NativeWind (Tailwind CSS for React Native): Viết style tiện lợi, đồng nhất, dễ bảo trì  
  - React Navigation: Điều hướng màn hình  
  - Formik + Yup: Quản lý form và validate dữ liệu

- **Cơ sở dữ liệu**:  
  - MySQL (Spring Boot): Lưu trữ thông tin người dùng, sản phẩm, đơn hàng, khuyến mãi  
  - Firebase Firestore: Lưu dữ liệu phụ trợ nếu cần đồng bộ nhanh hoặc lưu tạm (tuỳ tính năng)  
  - AsyncStorage (React Native): Lưu token, cấu hình, trạng thái đăng nhập cục bộ  

- **Xác thực và phân quyền**:  
  - Firebase Authentication: Đăng nhập/đăng ký bằng Email, Google  
  - Spring Security + JWT: Xác thực backend, phân quyền truy cập API

- **Các thư viện hỗ trợ**:

  - **Frontend (React Native)**:  
    - axios: Gọi API backend  
    - nativewind: Sử dụng Tailwind trong React Native  
    - redux, @reduxjs/toolkit: Quản lý state  
    - react-native-toast-message: Hiển thị thông báo  
    - @react-native-async-storage/async-storage: Lưu token và cài đặt cục bộ  
    - formik, yup: Xử lý form và validate  
    - react-navigation: Quản lý điều hướng nhiều màn hình  
    - firebase: Tích hợp Firebase Auth + Firestore

  - **Backend (Spring Boot)**:  
    - spring-boot-starter-web: Tạo REST API  
    - spring-boot-starter-security: Bảo mật và phân quyền  
    - jjwt: Tạo và xác minh JWT  
    - spring-boot-starter-data-jpa: Truy vấn cơ sở dữ liệu  
    - mysql-connector-java: Kết nối MySQL


## Các chức năng chính

### Người dùng (Customer)

1. **Đăng ký / Đăng nhập**
   - Đăng ký và đăng nhập bằng: Email, Google (Firebase Authentication)
   - Lưu token để xác thực và phân quyền truy cập

2. **Trang chủ**
   - Hiển thị danh mục món ăn: Gà rán, Burger, Nước uống, v.v.
   - Banner khuyến mãi (tùy chỉnh từ phía admin)
   - Gợi ý combo sản phẩm theo lịch sử mua hàng hoặc phổ biến

3. **Tìm kiếm và lọc sản phẩm**
   - Tìm kiếm theo tên món ăn
   - Bộ lọc theo danh mục, mức giá, loại món (đồ ăn, nước uống, combo)
   - Sắp xếp theo giá, độ phổ biến, sản phẩm mới nhất

4. **Xem chi tiết sản phẩm**
   - Hình ảnh, mô tả, giá, thông tin dinh dưỡng
   - Gợi ý combo liên quan

5. **Thêm vào giỏ hàng**
   - Chọn số lượng, ghi chú, combo kèm theo
   - Tự động tính tổng tiền

6. **Thanh toán**
   - Chọn địa chỉ giao hàng (đã lưu hoặc mới)
   - Chọn phương thức thanh toán: Tiền mặt, Momo, VNPAY (mô phỏng)
   - Nhập mã khuyến mãi (voucher)
   - Xác nhận đơn hàng

7. **Cài đặt & Hồ sơ cá nhân**
   - Cập nhật thông tin tài khoản
   - Đổi mật khẩu
   - Quản lý địa chỉ giao hàng
   - Đăng xuất

### Quản trị viên (Admin)

1. **Quản lý người dùng**
   - Phân quyền tài khoản: User / Admin
   - Xem danh sách người dùng
   - Khóa tài khoản vi phạm

2. **Quản lý sản phẩm**
   - CRUD món ăn, combo, danh mục
   - Cập nhật hình ảnh, mô tả, giá bán

3. **Quản lý đơn hàng**
   - Xem và cập nhật trạng thái đơn hàng
   - Lọc theo ngày, người dùng, trạng thái

4. **Quản lý mã khuyến mãi**
   - Tạo, chỉnh sửa, xoá mã giảm giá
   - Giới hạn số lượt sử dụng, thời gian áp dụng

5. **Báo cáo & thống kê**
   - Doanh thu theo ngày / tháng
   - Sản phẩm bán chạy
   - Lượt truy cập, hành vi người dùng

## Thiết kế model

![Database diagram](res/Database_diagram.png)

## 1. Module Product (Sản phẩm)

- Quản lý toàn bộ thông tin sản phẩm được bán.
- Lưu trữ các trường:
  - `id`: Mã định danh sản phẩm.
  - `name`: Tên sản phẩm.
  - `description`: Mô tả chi tiết.
  - `image_url`: Đường dẫn hình ảnh sản phẩm.
  - `price`: Giá cả.
  - `scale`: Kích thước hoặc quy cách.
  - `category_id`: Liên kết đến danh mục sản phẩm (Category).
- Kết nối trực tiếp với các module:
  - `ProductCart`: Chi tiết sản phẩm trong giỏ hàng.
  - `ProductDetail`: Chi tiết đầy đủ sản phẩm.
  - `ProductCombo`: Sản phẩm trong các combo.
- Điểm tham chiếu chính cho chức năng tìm kiếm, duyệt, mua hàng.

---

## 2. Module Customer (Khách hàng)

- Quản lý thông tin người dùng.
- Lưu trữ các thông tin:
  - `fullname`: Họ và tên khách hàng.
  - `username`: Tên đăng nhập.
  - `password`: Mật khẩu (đã mã hóa).
  - `email`: Email liên hệ.
  - `phone_number`: Số điện thoại.
- Liên kết với:
  - `Cart`: Giỏ hàng của khách.
  - `Order`: Đơn hàng đã đặt.
  - `Member`: Thành viên (chương trình khách hàng thân thiết).
- Theo dõi lịch sử mua hàng và hành vi người dùng.
- Cung cấp dữ liệu cho marketing và chương trình khách hàng thân thiết.

---

## 3. Module Order (Đơn hàng)

- Quản lý toàn bộ quy trình đặt hàng.
- Lưu trữ các trường:
  - `id`: Mã đơn hàng.
  - `customer_id`: Liên kết khách hàng.
  - `status`: Trạng thái đơn (mới, xử lý, hoàn thành...).
  - `date`: Ngày tạo đơn.
- Theo dõi trạng thái đơn từ khi tạo đến hoàn thành.
- Là đầu mối cho quy trình thanh toán và giao hàng.
- Kết nối với:
  - `Payment`: Xử lý thanh toán.
  - `Delivery`: Quản lý giao hàng.
- Cho phép truy xuất chi tiết và lịch sử mua hàng.

---

## 4. Module Cart (Giỏ hàng)

- Lưu trữ các sản phẩm khách đã chọn nhưng chưa thanh toán.
- Liên kết với:
  - `Customer`: Khách hàng sở hữu giỏ.
  - `ProductCart`: Chi tiết sản phẩm trong giỏ.
  - `ComboCart`: Các combo trong giỏ.
- Là bước trung gian trước khi tạo `Order`.

---

## 5. Module Payment (Thanh toán)

- Quản lý toàn bộ giao dịch tài chính.
- Lưu trữ thông tin:
  - `payment_method`: Phương thức thanh toán.
  - `amount`: Số tiền thanh toán.
  - `total_payment`: Tổng tiền phải trả.
  - `tax`: Thuế áp dụng.
  - `received`: Số tiền đã nhận.
- Liên kết với `Voucher` để áp dụng khuyến mãi.
- Cung cấp dữ liệu cho báo cáo tài chính và kế toán.

---

## 6. Module Category (Danh mục)

- Phân loại và tổ chức sản phẩm.
- Hỗ trợ tìm kiếm và duyệt sản phẩm theo nhóm.
- Cung cấp cấu trúc hiển thị sản phẩm trên giao diện.
- Giúp quản lý, phân tích sản phẩm theo danh mục.
- Là cơ sở cho các chiến lược marketing, khuyến mãi theo nhóm.

---

## 7. Module Combo

- Quản lý các gói sản phẩm kết hợp.
- Lưu trữ thông tin:
  - `name`: Tên combo.
  - `description`: Mô tả combo.
  - `image_url`: Hình ảnh combo.
- Liên kết với `ProductCombo` để xác định sản phẩm trong combo.
- Hỗ trợ chiến lược bán hàng theo gói, khuyến khích mua nhiều sản phẩm.
- Cho phép tùy chỉnh kích thước qua `setting_size`.
- Mục tiêu tăng giá trị đơn hàng trung bình và tối ưu doanh thu.

## Các đầu mục công việc

- Quản lý người dùng: Nguyễn Tiến Thành (Package User)  
  - Backend (Spring Boot)  
    - Spring Security + JWT Authentication cho đăng nhập/đăng ký an toàn  
    - OAuth2 tích hợp đăng nhập Google, Facebook qua Firebase  
    - Tạo bảng users, lưu trữ token đăng nhập, refresh token  
    - Quản lý phân quyền (Admin, User)  
  - Frontend (React Native)  
    - Firebase Auth cho đăng nhập Google/Facebook  
    - Giao diện đăng nhập, đăng ký, cập nhật hồ sơ cá nhân  
    - Quản lý lưu token và xác thực người dùng trong app  

- Quản lý sản phẩm: Phạm Quang Huy (Package Product)  
  - Backend (Spring Boot)  
    - RESTful API CRUD sản phẩm, danh mục, combo  
    - Kết nối MySQL với bảng products, categories  
    - Sử dụng Spring Data JPA thao tác dữ liệu  
    - Lưu ảnh sản phẩm lên Firebase Storage hoặc AWS S3  
    - Caching Redis tăng tốc load sản phẩm  
  - Frontend (React Native)  
    - Giao diện danh sách sản phẩm, chi tiết sản phẩm  
    - Tìm kiếm, lọc sản phẩm theo danh mục  
    - Load ảnh sản phẩm từ cloud storage  

- Quản lý đơn hàng: Đào Tùng Lâm (Package Order)  
  - Backend (Spring Boot)  
    - Tạo bảng orders, order_items  
    - API tạo đơn hàng, cập nhật trạng thái (Đang xử lý, Đang giao, Hoàn tất)  
    - WebSocket cập nhật trạng thái đơn hàng real-time  
  - Frontend (React Native)  
    - Giao diện giỏ hàng, đặt hàng  
    - Theo dõi trạng thái đơn hàng  
    - Hiển thị lịch sử đơn hàng khách hàng  
    - Thông báo real-time trạng thái đơn hàng  

- Thanh toán, khuyến mãi: Nguyễn Thành Long (Package Payment)  
  - Backend (Spring Boot)  
    - Tích hợp cổng thanh toán VNPAY, thẻ ngân hàng  
    - Tạo bảng bill, vouchers  
    - Xử lý mã giảm giá, voucher 
    - Báo cáo doanh thu, đơn hàng theo ngày/tháng/năm dành admin  
  - Frontend (React Native)  
    - Giao diện thanh toán, chọn phương thức, nhập mã giảm giá  
    - Trang báo cáo thống kê cho admin  

## Giao diện

### Giao diện Homepage

<div align="center">
  <img src="res/image.png" alt="Homepage" width="300"/>
</div>

### Giao diện thực đơn

<div align="center">
  <img src="res/image-2.png" alt="Discover" width="300"/>
</div>

### Giao diện chọn món

<div align="center">
  <img src="res/image-3.png" alt="Favorite" width="300"/>
</div>

### Giao diện giỏ hàng

<div align="center">
  <img src="res/image-4.png" alt="Profile" width="300"/>
</div>

### Giao diện thanh toán

<div align="center">
  <img src="res/image-5.png" alt="Tìm kiếm" width="300"/>
</div>

### Giao diện đã đặt hàng thành công

<div align="center">
  <img src="res/image-6.png" alt="Trang tạo, sửa, copy đồ uống" width="300"/>
</div>

### Giao diện Login

<div align="center">
  <img src="res/image-8.png" alt="Trang tạo nguyên liệu" width="300"/>
</div>

### Giao diện Profile

<div align="center">
  <img src="res/image-1.png" alt="Trang chi tiết đồ uống" width="300"/>
</div>

### Trang quản lý admin

<div align="center">
  <img src="res/image-7.png" alt="Trang quản lý Drink" width="300"/>
</div>

## Nguồn tham khảo giao diện
- Link 1
- Link 2
- Link 3


## Hướng dẫn cài đặt

## Prerequisites
Trước khi chạy ứng dụng, hãy đảm bảo bạn đã cài đặt các phần mềm sau:

- **Node.js** (Nên dùng phiên bản LTS mới nhất)  
- **Yarn** (Trình quản lý gói)  
- **Android Studio** (Dành cho phát triển Android)  
- **React Native CLI** (Tùy chọn nhưng khuyến khích cài đặt)  

## Bắt đầu

### 1. Clone Repository  
Chạy lệnh sau để tải dự án về máy:  
```bash
git clone <repository-url>
cd FE-FastFood
```

### 2. Cấu hình đường dẫn Android SDK

Tạo file local.properties trong thư mục android và thêm dòng sau:
```properties
sdk.dir=C:\\Users\\Username\\AppData\\Local\\Android\\sdk
```
> Thay Username bằng tên tài khoản máy tính của bạn.

### 3. Cài đặt các thư viện phụ thuộc
Chạy lệnh sau để cài đặt toàn bộ phụ thuộc:a
```bash
yarn install
```

### 4. Chạy ứng dụng
Để chạy ứng dụng trên thiết bị Android hoặc giả lập, dùng lệnh:
```bash
yarn android
```
> Đảm bảo bạn đang chạy giả lập Android hoặc kết nối thiết bị thật.
Nếu chạy trên thiết bị thật, để tăng tốc, dùng lệnh:
```bash
yarn android --active-arch-only
```




