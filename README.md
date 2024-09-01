# Stock Data Processing Dashboard

## Tổng Quan

Dự án này là một dịch vụ xử lý dữ liệu dùng để theo dõi giá chứng khoán và tiền điện tử theo thời gian thực. Dịch vụ này sẽ lấy dữ liệu thị trường theo thời gian thực, lưu trữ vào MongoDB và phát dữ liệu cập nhật thông qua WebSocket bằng Socket.IO. Dự án được xây dựng bằng Node.js, MongoDB, và Kafka để xử lý dữ liệu theo thời gian thực một cách mở rộng.

## Tính Năng

- **Truyền Dữ Liệu Thời Gian Thực:** Lấy dữ liệu trực tiếp từ API WebSocket của Binance theo khoảng thời gian định trước.
- **Lưu Trữ Dữ Liệu:** Lưu trữ dữ liệu thị trường vào MongoDB để lưu trữ lâu dài.
- **Phát Dữ Liệu Qua WebSocket:** Gửi cập nhật thời gian thực đến các client thông qua Socket.IO.
- **Tích Hợp Kafka:** Xử lý và quản lý luồng dữ liệu thông qua Kafka.

## Công Nghệ Sử Dụng

- **Node.js:** Môi trường chạy JavaScript phía server.
- **MongoDB:** Cơ sở dữ liệu NoSQL để lưu trữ dữ liệu thị trường.
- **Kafka:** Nền tảng streaming phân tán dùng để xử lý dữ liệu thời gian thực.
- **Socket.IO:** Thư viện cho kết nối WebSocket thời gian thực.
- **Express:** Web framework cho Node.js.
- **dotenv:** Thư viện để quản lý biến môi trường từ file `.env`.
- **morgan:** Middleware ghi log HTTP request.


## Cài Đặt

1. **Clone repository:**
    ```bash
    git clone https://github.com/trduyTh4nh/stock-data-tracking.git
    ```

2. **Cài đặt các dependency:**
   
    2.1 Tạo Kafka Container
    ```bash
    docker-compose -f kafka.yml up -d
    ```
   2.2 Frontend for stock dashboard
    ```bash
    cd candle-stock
    npm install
    npm start
    ```
   2.3 Service 1: 
   ```bash
   cd data-store-api-service
   npm install
   npm start
   ```
   2.4 Service 2
   ```bash
   cd data-transfer-processing-service
   npm install
   npm start
   ```

## Sử Dụng

1. **Khởi động Kafka server:**
   Đảm bảo rằng Kafka đang chạy trên máy của bạn hoặc trên server trước khi bắt đầu ứng dụng.

2. **Kết nối WebSocket:**
   Client có thể kết nối tới WebSocket server để nhận cập nhật thời gian thực về dữ liệu chứng khoán và tiền điện tử.

3. **Lấy dữ liệu ban đầu:**
   Sử dụng API để lấy dữ liệu ban đầu từ cơ sở dữ liệu MongoDB.

4. **Theo dõi dữ liệu thời gian thực:**
   Khi có dữ liệu mới từ Kafka, nó sẽ được lưu vào MongoDB và phát đến tất cả các client kết nối với WebSocket.
.

## Sự Kiện WebSocket

- **`dataUpdate`** - Được phát khi có dữ liệu mới, yêu cầu các client lấy dữ liệu cập nhật.

## Cảm Ơn

- Cảm ơn [Binance](https://www.binance.com/) vì đã cung cấp API dữ liệu thời gian thực.
- Cảm ơn [Kafka](https://kafka.apache.org/) vì nền tảng streaming mạnh mẽ.
- Cảm ơn đội ngũ [Socket.IO](https://socket.io/) đã cung cấp thư viện WebSocket tuyệt vời.

 ## Minh Họa
![image](https://github.com/user-attachments/assets/003fd20d-7605-4c70-aa9f-920d1b48f89a)

