# Shortlink Service

Dự án rút gọn liên kết (Shortlink) được xây dựng trên nền tảng Node.js (Express), React (Vite) và MySQL. Hệ thống đã được cấu hình sẵn Docker để triển khai nhanh chóng và ổn định.

## 🚀 Tính năng chính
- Rút gọn liên kết nhanh.
- Lưu trữ lịch sử rút gọn.
- Hệ thống container hóa hoàn chỉnh.
- Hỗ trợ Nginx Proxy và Ngrok (truy cập từ xa).

## 🛠 Yêu cầu hệ thống
- Cần cài đặt sẵn **Docker** và **Docker Compose**.

## 📦 Hướng dẫn cài đặt nhanh

1. **Chuẩn bị file cấu hình:**
   Tại thư mục gốc của dự án, copy file `.env.example` thành `.env`:
   ```bash
   cp .env.example .env
   ```
   Mở file `.env` và cập nhật các thông số cần thiết (đặc biệt là mật khẩu Database).

2. **Khởi chạy bằng Docker:**
   Chạy lệnh sau để hệ thống tự động build và kích hoạt các services:
   ```bash
   docker-compose up -d --build
   ```

3. **Kiểm tra kết quả:**
   Sau khi docker chạy xong, bạn có thể kiểm tra danh sách container đang chạy:
   ```bash
   docker-compose ps
   ```

## 🌐 Các cổng truy cập mặc định
- **Giao diện người dùng (Frontend):** [http://localhost](http://localhost) (Port 80)
- **API (Backend):** [http://localhost/api](http://localhost/api)
- **Database (MySQL):** Chạy nội bộ trong network của Docker (port 3306).

## 📂 Cấu trúc dự án
- `/backend`: API server viết bằng Express.js.
- `/frontend`: Giao diện người dùng sử dụng React + Vite.
- `/nginx`: Cấu hình Nginx làm Proxy ngược, điều hướng request cho Front/Back.
- `docker-compose.yml`: File quản lý việc kết nối và vận hành các container.

## ⚠️ Một số lưu ý
- **Ngrok:** Nếu bạn bật service ngrok trong docker-compose, hãy vào bảng điều khiển ngrok để lấy địa chỉ URL public.
- **Port:** Nếu port 80 trên máy của bạn đã có ứng dụng khác dùng, hãy sửa lại phần `ports` của service `nginx` trong file `docker-compose.yml`.
- **Database:** Dữ liệu MySQL được lưu tại volume `db_data`, không bị mất khi xóa container.

