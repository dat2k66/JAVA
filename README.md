# Cinema Dashboard Monorepo Scaffold

Đã tách sẵn cấu trúc cho frontend React và backend Java (Spring Boot).

## Frontend (`frontend/`)

- `package.json`: cấu hình Vite + React 18. Chạy `npm install` để cài dependencies.
- `vite.config.js`: cổng 5173, đã bật plugin React.
- `src/`: gồm `main.jsx`, `App.jsx`, `index.css` để bạn dựng layout dashboard theo mockup.
- `public/index.html`: điểm mount cho React.

### Chạy thử

```bash
cd frontend
npm install
npm run dev
```

## Backend (`backend/`)

- `pom.xml`: Maven với Spring Boot 3, starter web + test.
- `src/main/java/com/example/cinema/`: `CinemaApplication.java` (entry) và `web/HealthController.java` (endpoint `/api/health` mẫu).
- `src/main/resources/application.properties`: config cơ bản (port 8080).
- `src/test/java/com/example/cinema/`: test placeholder.

### Chạy thử

```bash
cd backend
mvn spring-boot:run
```

## Gợi ý kết nối

- Trong React, tạo các service gọi API tới `http://localhost:8080/api/...`.
- Khi ready để deploy, cân nhắc chia env (`.env`) cho base URL.

Tùy chỉnh thêm thư mục (components, services, repositories, v.v.) theo nhu cầu dự án.***
