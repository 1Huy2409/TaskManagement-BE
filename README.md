# Task Management Backend

> Backend API cho ứng dụng quản lý công việc (Task Management) với tính năng quản lý workspace, board, task và phân quyền RBAC.

## 📋 Mục lục

- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Database Migration](#database-migration)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [RBAC System](#rbac-system)
- [Troubleshooting](#troubleshooting)

## 🚀 Công nghệ sử dụng

- **Runtime**: Node.js v18+
- **Framework**: Express.js 5.1.0
- **Language**: TypeScript 5.9+
- **Database**: PostgreSQL 17
- **ORM**: TypeORM 0.3.27
- **Authentication**:
  - JWT (jsonwebtoken)
  - Passport.js (Google OAuth, Local Strategy)
- **Validation**: Zod 4.1.9
- **API Documentation**: OpenAPI 3.0 (Swagger)
- **Testing**: Vitest 3.2.4
- **Containerization**: Docker & Docker Compose

## 📦 Yêu cầu hệ thống

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker Desktop (nếu chạy với Docker)
- PostgreSQL 17 (nếu chạy local không dùng Docker)

## ⚙️ Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd TaskManagement-BE
```

### 2. Install dependencies

```bash
npm install
```

### 3. Cấu hình environment variables

Copy file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Sau đó chỉnh sửa file `.env` với thông tin của bạn:

```env
# Server
PORT=2409

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5434
POSTGRES_USER=postgres
POSTGRES_DB=TaskManagementDB
POSTGRES_PASSWORD=your_password

# JWT
ACCESS_SECRET_KEY=your_secret_key_here
ACCESS_TOKEN_EXPIRE=15m
REFRESH_SECRET_KEY=your_refresh_secret_key_here
REFRESH_TOKEN_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:{PORT}/api/v1/auth/google/callback

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Session
SESSION_SECRET=your_session_secret

# Frontend
FRONTEND_BASE_URL=http://localhost:5173
```

## 🏃 Chạy ứng dụng

### Option 1: Chạy với Docker (Recommended)

**Chỉ chạy Database trong Docker:**

```bash
# Start PostgreSQL container
npm run docker:dev:up

# Chạy backend ở local
npm run dev
```

**Hoặc chạy full stack trong Docker:**

```bash
# Build và start containers
docker-compose up --build

# Hoặc chạy background
docker-compose up -d

# Xem logs
docker-compose logs -f backend

# Stop containers
docker-compose down

# Stop và xóa volumes (reset database)
docker-compose down -v
```

### Option 2: Chạy local (Không Docker)

**Yêu cầu:**

- PostgreSQL 17 đã cài đặt trên máy
- Database đã được tạo

```bash
# Update .env với thông tin database local
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_DB=TaskManagementDB
POSTGRES_PASSWORD=your_password

# Chạy ứng dụng
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:${PORT}`

## 🗄️ Database Migration

### Tạo migration mới (từ thay đổi entities)

```bash
npm run migration:generate src/common/migrations/MigrationName
```

### Tạo migration rỗng

```bash
npm run migration:create src/common/migrations/MigrationName
```

### Chạy migrations

```bash
npm run migration:run
```

### Xem trạng thái migrations

```bash
npm run migration:show
```

### Rollback migration gần nhất

```bash
npm run migration:revert
```

### Seed data (Roles & Permissions)

Migrations seed được tự động chạy khi start ứng dụng lần đầu. Nếu cần chạy lại:

```bash
npm run migration:run
```

Migration sẽ tạo:

- 6 roles: `workspace_owner`, `workspace_admin`, `workspace_member`, `board_owner`, `board_admin`, `board_member`
- 12 permissions: workspace và board permissions

## 📁 Cấu trúc dự án

```
src/
├── api-docs/                 # OpenAPI documentation
│   ├── openAPIDocumentGenerator.ts
│   ├── openAPIResponseBuilder.ts
│   └── openAPIRouter.ts
├── apis/                     # API modules
│   ├── auth/                 # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.router.ts
│   │   ├── repositories/
│   │   ├── schemas/
│   │   └── strategy/         # Passport strategies
│   ├── user/                 # User module
│   ├── workspace/            # Workspace module
│   │   ├── workspace.controller.ts
│   │   ├── workspace.service.ts
│   │   ├── workspace.router.ts
│   │   ├── repositories/
│   │   ├── mapper/
│   │   └── schemas/
│   ├── board/                # Board module
│   └── healthcheck/          # Health check endpoint
├── common/
│   ├── constants/            # Constants (permissions, etc.)
│   ├── entities/             # TypeORM entities
│   │   ├── user.entity.ts
│   │   ├── workspace.entity.ts
│   │   ├── board.entity.ts
│   │   ├── role.entity.ts
│   │   ├── permission.entity.ts
│   │   └── ...
│   ├── handler/              # Error handlers
│   ├── middleware/           # Middlewares
│   │   ├── authentication.ts
│   │   ├── authorization.ts
│   │   └── asyncHandler.ts
│   ├── migrations/           # Database migrations
│   ├── repositories/         # Base repository interfaces
│   ├── router/               # Main router
│   └── utils/                # Utility functions
│       ├── auth.util.ts
│       ├── handlePassword.ts
│       └── mailService.ts
├── config/
│   └── db.config.ts          # Database configuration
├── types/                    # TypeScript type definitions
└── index.ts                  # Application entry point
```

## 📚 API Documentation

Sau khi start server, truy cập Swagger UI tại:

```
http://localhost:${PORT}/api-docs
```

## 🔐 RBAC System

Hệ thống phân quyền dựa trên Role-Based Access Control (RBAC) với 2 levels:

### Workspace Level Roles

| Role               | Permissions                                            |
| ------------------ | ------------------------------------------------------ |
| `workspace_owner`  | Tất cả quyền trong workspace (bao gồm xóa workspace)   |
| `workspace_admin`  | Quản lý workspace, boards, members (trừ xóa workspace) |
| `workspace_member` | Chỉ xem workspace và boards                            |

### Board Level Roles

| Role           | Permissions                                  |
| -------------- | -------------------------------------------- |
| `board_owner`  | Tất cả quyền trong board (bao gồm xóa board) |
| `board_admin`  | Quản lý board, members (trừ xóa board)       |
| `board_member` | Chỉ xem board                                |

### Permissions

#### Workspace Permissions

- `workspace:view` - Xem workspace
- `workspace:create` - Tạo workspace
- `workspace:update` - Cập nhật workspace
- `workspace:delete` - Xóa workspace
- `workspace:manage_members` - Quản lý members
- `workspace:view_members` - Xem members

#### Board Permissions

- `board:view` - Xem board
- `board:create` - Tạo board
- `board:update` - Cập nhật board
- `board:delete` - Xóa board
- `board:manage_members` - Quản lý members
- `board:view_members` - Xem members

## 👥 Team

- **Developer**: Nguyen Huu Nhat Huy
- **Email**: nhathuy2409@gmail.com
