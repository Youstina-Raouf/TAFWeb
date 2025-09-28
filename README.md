# 🥐 Sweet Dreams Bakery - MERN Stack E-commerce Website

A full-stack bakery e-commerce website built with the MERN stack (MongoDB, Express.js, React, Node.js). Features include user authentication, product management, shopping cart, order processing, and admin panel.

## ✨ Features

### Customer Features
- **User Authentication**: Register, login, and profile management
- **Product Browsing**: Browse products by category with search and filtering
- **Shopping Cart**: Add/remove items, quantity management, persistent cart
- **Order Management**: Place orders, view order history, cancel orders
- **Responsive Design**: Mobile-friendly interface with Material-UI

### Admin Features
- **Dashboard**: Overview of sales, orders, products, and users
- **Product Management**: Add, edit, delete products with full CRUD operations
- **Order Management**: View and update order statuses
- **User Management**: View users and manage account status
- **Inventory Tracking**: Monitor stock levels and low-stock alerts

### Product Categories
- 🥖 Fresh Bakery
- 🍪 Cookies
- 🥐 Croissants
- 🍞 Artisan Bread
- 🧁 Pastries

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **Context API** - State management

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd bakery-shop-mern
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 4. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bakery-shop
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
JWT_EXPIRE=7d
```

### 5. Start the Application

#### Development Mode (Both Backend and Frontend)
```bash
npm run dev:full
```

#### Or Start Separately

Backend only:
```bash
npm run dev
```

Frontend only:
```bash
cd client
npm start
```

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  isActive: Boolean
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String (bakery/cookies/croissants/bread/pastries),
  images: [String],
  stock: Number,
  isAvailable: Boolean,
  ingredients: [String],
  allergens: [String],
  nutritionalInfo: Object,
  weight: Object,
  tags: [String],
  rating: Object,
  featured: Boolean
}
```

### Order Model
```javascript
{
  user: ObjectId (ref: User),
  orderNumber: String (unique),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  shippingAddress: Object,
  billingAddress: Object,
  paymentMethod: String,
  paymentStatus: String,
  subtotal: Number,
  tax: Number,
  shipping: Number,
  total: Number,
  status: String,
  notes: String
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search` - Search products

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/:id/payment` - Process payment

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status

## 🎨 Frontend Structure

```
client/src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── Product/
│   │   └── ProductCard.tsx
│   ├── Admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminProducts.tsx
│   │   ├── AdminOrders.tsx
│   │   └── AdminUsers.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── pages/
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Profile.tsx
│   ├── Orders.tsx
│   └── Admin.tsx
├── services/
│   └── api.ts
├── types/
│   └── index.ts
└── App.tsx
```

## 🔐 Authentication & Authorization

- **JWT-based authentication** with secure token storage
- **Role-based access control** (User/Admin)
- **Protected routes** for authenticated users
- **Admin-only routes** for administrative functions
- **Password hashing** with bcryptjs

## 🛒 Shopping Cart Features

- **Persistent cart** using localStorage
- **Real-time updates** when adding/removing items
- **Stock validation** to prevent overselling
- **Quantity management** with min/max constraints
- **Cart persistence** across browser sessions

## 📱 Responsive Design

- **Mobile-first approach** with Material-UI
- **Responsive grid system** for product layouts
- **Touch-friendly interface** for mobile devices
- **Optimized images** and lazy loading

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)
1. Set environment variables
2. Connect to MongoDB Atlas
3. Deploy to your preferred platform

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the build folder
3. Set environment variables for API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the repository.

---

**Happy Baking! 🥐🍪🧁**