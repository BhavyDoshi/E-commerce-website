# Studio Studio Mart — E‑Commerce (MERN) Monorepo

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js CI](https://img.shields.io/badge/Node.js-%3E%3D16-brightgreen)](https://nodejs.org/)

A modern full-stack e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). This monorepo contains the customer storefront, an admin control panel, and the backend API with separate authentication and role-based access.

## 🎯 Overview

Studio Mart includes the user storefront, an admin dashboard for product and order management, and a REST API backend. It supports local development and a demo fallback mode when MongoDB is unavailable.

## Table of Contents

- [Features](#✨-key-features)
- [Tech Stack](#💻-tech-stack)
- [Quick Start](#🚀-getting-started)
- [Scripts](#scripts)
- [Project Structure](#📁-project-structure)
- [API Endpoints](#🔌-api-endpoints)
- [Contributing](#🤝-contributing)
- [License](#📄-license)

### 👥 User (Customer)

- Independent user login and registration (`/login`) in the user app
- Browse and search products
- Add items to cart and manage quantities
- Checkout panel accessible from the cart
- Order history with latest order highlighted

### 🛠️ Admin Panel

- Independent admin login (`/login`) in the admin app
- Full product CRUD (create/read/update/delete)
- Customer list and order management
- Dashboard with admin metrics and role-restricted routes

### ⚙️ Backend API

- RESTful API with JWT-based authentication
- Role-based access control (admin vs customer)
- MongoDB via Mongoose, with mock/demo fallback data for development

## ✨ Key Features

- Separate user and admin authentication flows
- Checkout panel available from the cart page
- Order history and admin order management
- JWT token authentication and RBAC
- Demo fallback data for offline development
- Responsive UI powered by Tailwind CSS

## 📁 Project Structure

```text
ecommerce/
├── admin/               # Admin panel (Next.js, default port 3001)
├── backend/             # Express API (Node.js)
├── user/                # Customer storefront (Next.js, default port 3000)
├── package.json         # Root workspace config and scripts
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js v16 or later
- npm (or yarn)
- MongoDB (local or Atlas)

### Quick start

```bash
git clone <repository-url>
cd ecommerce
npm install
# start services (open separate terminals)
npm run dev:backend
npm run dev:user
npm run dev:admin
```

### Environment

Create `backend/.env`:

```env
PORT=4000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=your_jwt_secret_key
```

Create `user/.env.local` and/or `admin/.env.local` (optional):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
```

## 🚀 Getting Started

### Prerequisites

- Node.js v16 or later
- npm (or yarn)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd ecommerce
```

1. Install dependencies (root or per workspace)

```bash
npm install
# or (if workspaces script exists)
npm run install:all
```

1. Configure environment variables

Backend (`backend/.env`):

```env
PORT=4000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=your_jwt_secret_key
```

Frontend (optional) - create `user/.env.local` and/or `admin/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
```

1. Start MongoDB (local) or ensure your Atlas connection string is in `MONGODB_URI`.

```bash
# start local MongoDB (platform dependent)
mongod
```

### Running the App

From the root folder, run each service in a separate terminal:

```bash
npm run dev:backend   # starts backend (default port 4000)
npm run dev:user      # starts user frontend (default port 3000)
npm run dev:admin     # starts admin frontend (default port 3001)
```

Or start each individually:

```bash
# Backend
cd backend && npm start

# User frontend
cd user && npm run dev

# Admin frontend
cd admin && npm run dev
```

Open in browser after startup:

- User frontend: [http://localhost:3000](http://localhost:3000)
- Admin frontend: [http://localhost:3001](http://localhost:3001)
- Backend API: [http://localhost:4000](http://localhost:4000)

## 📍 Common Routes (defaults)

User App ([http://localhost:3000](http://localhost:3000))

- `/login` — user login/register
- `/dashboard` — product listings
- `/products/[id]` — product details
- `/cart` — shopping cart
- `/checkout` — checkout panel (from cart)
- `/orders` — user order history

Admin App ([http://localhost:3001](http://localhost:3001))

- `/login` — admin login
- `/dashboard` — admin overview
- `/products` — manage products
- `/products/new` — create product
- `/customers` — view customers
- `/orders` — view/manage orders

## 🔐 Authentication

Both user and admin flows use email/password sign-in with JWT tokens. Role-based middleware protects admin routes. Sessions and tokens are managed on the client and verified by the backend.

## 💻 Tech Stack

- Frontend: Next.js 14, React 18, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Auth: JWT (JSON Web Tokens)
- Package manager: npm (workspaces)

## Workflows

User workflow: browse → add to cart → checkout → view orders.

Admin workflow: manage products/customers/orders from the admin dashboard.

## 🔌 API Endpoints (examples)

- `POST /api/auth/register` — register
- `POST /api/auth/login` — login
- `GET /api/products` — list products
- `GET /api/products/:id` — product details
- `POST /api/products` — create product (admin)
- `POST /api/orders` — create order
- `GET /api/orders/my-orders` — user orders
- `GET /api/orders` — all orders (admin)

## Scripts

- `npm run dev` — start all workspaces (if configured)
- `npm run dev:backend` — start backend API
- `npm run dev:user` — start user frontend
- `npm run dev:admin` — start admin frontend


## Features in detail

- Checkout: modal/panel from cart, shipping form, order confirmation
- Orders: status, history, latest order highlighted
- Product management: images, categories, admin CRUD
- Demo mode: fallback mock data when DB is offline

## Security & middleware

- JWT verification for protected endpoints
- Admin middleware validates `admin` role for admin routes
- Protected routes return 401/403 when unauthorized

## Error handling & demo credentials

- Falls back to demo data if MongoDB is unavailable
- Clear UI error messages and proper HTTP statuses for auth errors

Demo sample accounts (development/demo mode):

```text
User:  user@example.com / password123
Admin: admin@example.com / password123
```

## Contributing

1. Fork the repository
1. Create a feature branch (`git checkout -b feature/Name`)
1. Commit your changes and push
1. Open a pull request

## License

MIT

## Support

Open an issue on the repository for bugs or feature requests.

---

**Last Updated**: May 2026
**Version**: 1.0.0
