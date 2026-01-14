# GEMINI SOLARISS - Solar Panel E-Commerce Platform

A complete, production-ready single-vendor e-commerce platform for solar panels and renewable energy solutions.

## 🏢 Company Information

**Company Name:** GEMINI SOLARISS  
**Industry:** Solar panels, Renewable energy solutions, Residential & commercial solar products  
**Founder:** Niranjan Prabhu Jayaprakash

**Business Address:**
- Building No./Flat No.: No.63-A
- Premises: Anna Enclave
- Road/Street: East Coast Road
- Locality: Injambakkam
- City: Chennai
- District: Chennai
- State: Tamil Nadu
- PIN Code: 600115
- Country: India

## 🧱 Tech Stack

### Frontend
- React 18 (Vite)
- Tailwind CSS
- Material UI (selective components)
- React Router v6
- Axios
- Redux Toolkit
- React PDF (for invoices)

### Backend
- Node.js
- Express.js
- PostgreSQL (Sequelize ORM)
- JWT Authentication
- Stripe, Razorpay, PayPal (sandbox)
- PDF generation (PDFKit)

## 🎯 Core Features

### Customer Features
- ✅ Solar product catalog (panels, inverters, batteries, accessories)
- ✅ Product categories (Residential, Commercial, On-Grid, Off-Grid, Hybrid)
- ✅ Advanced search & filters (wattage, efficiency, price, brand)
- ✅ Product detail pages with technical specifications
- ✅ Shopping cart
- ✅ Secure checkout & multiple payment gateways
- ✅ Coupon & discount system
- ✅ User authentication & profiles
- ✅ Order history & tracking
- ✅ PDF invoice generation

### Admin Dashboard
- ✅ Role-based admin authentication
- ✅ Product management (CRUD)
- ✅ Category management
- ✅ Inventory & stock management
- ✅ Order lifecycle management
- ✅ User management
- ✅ Coupon & discount management
- ✅ Dashboard analytics (orders, revenue, stock alerts)

## 📁 Project Structure

```
gemini-solariss/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express backend
├── shared/            # Shared types/utilities
├── configs/           # Configuration files
├── scripts/           # Utility scripts
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+ (local or cloud)
- Stripe, Razorpay, PayPal sandbox accounts (for payments - optional)

### Installation

1. **Clone and install dependencies:**
```bash
npm run install:all
```

2. **Set up environment variables:**

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development

# PostgreSQL
DB_NAME=gemini_solariss
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Payment Gateways (Optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

3. **Install and Start PostgreSQL:**
```bash
# Option 1: Install PostgreSQL locally
# Download from: https://www.postgresql.org/download/

# Option 2: Use Docker
docker run --name postgres-gemini -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=gemini_solariss -p 5432:5432 -d postgres

# Create database (if not using Docker)
# In psql: CREATE DATABASE gemini_solariss;
```

4. **Seed the database:**
```bash
cd backend
npm run seed
```

5. **Run the application:**
```bash
# Development (runs both frontend and backend)
npm run dev

# Or run separately:
npm run dev:backend  # Backend on http://localhost:5000
npm run dev:frontend # Frontend on http://localhost:5173
```

## 👤 Default Admin Credentials

After seeding:
- **Email:** admin@geminisolariss.com
- **Password:** Admin@123

⚠️ **Change these credentials immediately in production!**

## 📦 Payment Gateway Setup

### Stripe
1. Sign up at https://stripe.com
2. Get test API keys from Dashboard → Developers → API keys
3. Add keys to backend `.env`

### Razorpay
1. Sign up at https://razorpay.com
2. Get test keys from Dashboard → Settings → API Keys
3. Add keys to backend `.env`

### PayPal
1. Sign up at https://developer.paypal.com
2. Create a sandbox app
3. Get Client ID and Secret
4. Add keys to backend `.env`

## 🏗️ Architecture

### Backend API Structure
```
/api/auth          - Authentication (login, register, profile)
/api/products      - Product CRUD operations
/api/categories    - Category management
/api/cart          - Shopping cart operations
/api/orders        - Order management
/api/payments      - Payment processing
/api/coupons       - Coupon management
/api/users         - User management
/api/admin         - Admin operations
```

### Frontend Structure
```
/src
  /components      - Reusable UI components
  /pages           - Page components
  /store           - Redux store
  /services        - API services
  /utils           - Utility functions
  /hooks           - Custom React hooks
  /assets          - Static assets
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing (bcrypt)
- Input validation & sanitization
- CORS configuration
- Rate limiting
- Secure payment processing

## 📝 API Documentation

API endpoints are RESTful. See backend routes for detailed documentation.

## 🚢 Deployment

### Backend
- Deploy to Heroku, Railway, or AWS
- Set environment variables
- Ensure MongoDB connection

### Frontend
- Build: `npm run build` (in frontend directory)
- Deploy to Vercel, Netlify, or AWS S3

## 📄 License

MIT License

## 👨‍💻 Developer

**Niranjan Prabhu Jayaprakash**  
Founder, GEMINI SOLARISS

---

Built with ❤️ for renewable energy solutions

