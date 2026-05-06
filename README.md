# Studio Mart - E-Commerce MERN Application

A modern full-stack e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). This is a complete monorepo containing a customer storefront, admin control panel, and backend API with separate authentication flows.

## 🎯 Overview

Studio Mart is a complete e-commerce solution featuring:

### 👥 **User/Customer Side**
- Independent user login and registration at `/login`
- Browse and search products on dashboard
- Add items to cart and manage quantities
- Checkout panel that appears after cart confirmation
- Order history with latest order prominently displayed
- User-only account management

### 🛠️ **Admin Panel**
- Independent admin login and registration at `/login`
- Complete product management (create, read, update, delete)
- Customer list and management
- Order tracking and management
- Admin dashboard with key metrics
- Admin-only authorization

### ⚙️ **Backend API**
- RESTful API for all operations
- Role-based access control
- JWT authentication with session management
- MongoDB integration with Mongoose
- Fallback demo data for offline mode

## ✨ Key Features

- **Separate Authentication**: Independent login pages for users and admins - no shared auth screens
- **Smart Checkout**: Checkout only accessible from cart page as a panel, not a navigation item
- **Order Management**: Latest orders displayed in Orders tab (not Notifications)
- **JWT Auth**: Secure token-based authentication with role-based access control
- **Demo Mode**: Works with fallback data when database is offline
- **Responsive Design**: Tailwind CSS for modern, mobile-friendly UI

## 📁 Project Structure

```
d:\ecommerce/
├── user/                 # Customer frontend (Next.js, port 3000)
│   ├── app/
│   │   ├── login/       # User login & registration
│   │   ├── register/    # Register redirects to login
│   │   ├── dashboard/   # Product browsing
│   │   ├── cart/        # Shopping cart management
│   │   ├── checkout/    # Checkout panel
│   │   ├── orders/      # Order history with latest order
│   │   ├── auth/        # Auth page (legacy)
│   │   └── ...
│   ├── components/      # Navbar, ProductCard, AddToCartButton, etc.
│   ├── context/         # Auth & Cart context
│   └── lib/             # API calls & mock data
│
├── admin/               # Admin panel (Next.js, port 3001)
│   ├── app/
│   │   ├── login/       # Admin login & registration (separate)
│   │   ├── dashboard/   # Admin overview
│   │   ├── products/    # Product management
│   │   ├── products/new # Create new product
│   │   ├── customers/   # Customer list
│   │   ├── orders/      # Order management
│   │   └── ...
│   ├── components/      # AdminNav, StatCard, etc.
│   ├── context/         # Auth context
│   └── lib/             # API calls & mock data
│
└── backend/             # Express API (Node.js, port 4000)
    ├── server.js        # Main server file
    ├── config/
    │   └── db.js        # MongoDB connection
    ├── models/          # User, Product, Order schemas
    ├── routes/          # API endpoints
    ├── controllers/     # Route handlers
    ├── middleware/      # Auth & admin middleware
    └── ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   **Backend** - Create `backend/.env`:
   ```env
   PORT=4000
   CLIENT_URL=http://localhost:3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

   **Frontend** (optional) - Add to `user/.env.local` or `admin/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod

   # Or use MongoDB Atlas connection string in .env
   ```

### Running the Application

**From the root directory, run all services:**
```bash
npm run dev:backend
npm run dev:user
npm run dev:admin
```

Or start each individually:
```bash
# Terminal 1 - Backend API
cd backend && npm start

# Terminal 2 - User Frontend
cd user && npm run dev

# Terminal 3 - Admin Frontend
cd admin && npm run dev
```

## 📍 Application Routes

### User App (http://localhost:3000)

| Route | Purpose |
|-------|---------|
| `/login` | **User-only** login & registration page |
| `/register` | Redirects to `/login` |
| `/dashboard` | Browse and view all products |
| `/products/[id]` | View product details |
| `/cart` | Shopping cart with checkout button |
| `/checkout` | Checkout panel (accessible only from cart) |
| `/orders` | Order history with latest order displayed |

### Admin App (http://localhost:3001)

| Route | Purpose |
|-------|---------|
| `/login` | **Admin-only** login & registration page |
| `/dashboard` | Admin overview with statistics |
| `/products` | List all products |
| `/products/new` | Create new product |
| `/customers` | View registered customers |
| `/orders` | View all customer orders |

## 🔐 Authentication

### User Authentication
- Register: Create new customer account
- Login: Use email & password
- Session: Stored in browser localStorage

### Admin Authentication
- Register: Create new admin account
- Login: Use email & password (admin role required)
- Role-Based: Admin routes protected by middleware

### Security Features
- JWT token-based authentication
- Role-based access control (RBAC)
- Protected API endpoints
- Secure session management

## 🛒 User Workflow

1. **Browse**: Visit `/dashboard` to browse products
2. **Shop**: Add items to cart from product listings
3. **Review**: Go to `/cart` to review items and quantities
4. **Checkout**: Click "Continue to checkout" button to open checkout panel
5. **Order**: Fill shipping details and confirm order
6. **Track**: View order in `/orders` - latest order shows at the top

## 👨‍💼 Admin Workflow

1. **Dashboard**: Overview with key metrics
2. **Products**: Manage inventory (create, view, delete)
3. **Customers**: See registered user accounts
4. **Orders**: Track and manage customer orders

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) |
| **Package Manager** | npm workspaces |
| **Development** | Hot reload, Demo fallback data |

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Authenticate user/admin

### Products (User)
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details

### Products (Admin)
- `POST /api/products` - Create product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders` - Get all orders (admin)

### Admin Stats
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/customers` - List all customers

## ⚙️ Features in Detail

### Checkout System
- **One-Step Panel**: Checkout is a modal/panel accessible only from the cart page
- **Shipping Form**: Collects full name, address, and phone number
- **Cash on Delivery**: Payment method (COD only)
- **Order Confirmation**: Creates order and shows in Orders page
- **Auto-Redirect**: After checkout, redirects to Orders page showing latest order

### Order Management
- **Latest Order Display**: Top of Orders page shows most recent order
- **Order Status**: Displays order status and payment status
- **Order History**: List of all previous orders with details
- **Admin View**: Admins can view all customer orders

### Product Management
- **Image Support**: Products can have images
- **Categories**: Products can be categorized
- **Admin Control**: Only admins can create/delete products
- **Real-time Updates**: Changes reflect immediately

### Demo Mode
- **Fallback Data**: When MongoDB is offline, uses mock data
- **Full Functionality**: All features work with demo data
- **Development Friendly**: Perfect for testing without database

## 🔒 Security & Middleware

### Authentication Middleware
- Verifies JWT tokens on protected routes
- Validates user session

### Admin Middleware
- Checks user role is 'admin'
- Prevents unauthorized access to admin routes
- Applied to all admin-only endpoints

### Protected Routes
- All API endpoints with sensitive data
- Admin routes and pages
- User-specific data (orders, cart)

## 🐛 Error Handling

- Graceful fallback to demo data if MongoDB unavailable
- Clear error messages in UI
- Invalid credentials properly rejected
- Protected routes return 401/403 errors

## 📝 Sample Credentials (Demo Mode)

```
User Account:
Email: user@example.com
Password: password123
Role: customer

Admin Account:
Email: admin@example.com
Password: password123
Role: admin
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

**Last Updated**: May 2026
**Version**: 1.0.0
