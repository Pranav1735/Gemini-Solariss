# GEMINI SOLARISS - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gemini-solariss
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRE=7d

# Payment Gateways (Optional for development)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

FRONTEND_URL=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### 4. Seed Database

```bash
cd backend
npm run seed
```

This will create:
- Admin user: admin@geminisolariss.com / Admin@123
- Test customer: customer@test.com / Customer@123
- Sample categories and products
- Sample coupons

### 5. Run Application

**Development (both frontend and backend):**
```bash
# From root directory
npm run dev
```

**Or run separately:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Default Credentials

- **Admin:** admin@geminisolariss.com / Admin@123
- **Customer:** customer@test.com / Customer@123

## Sample Coupons

- **WELCOME10:** 10% off (min ₹10,000)
- **SOLAR2024:** 15% off solar panels (min ₹50,000)
- **FLAT5000:** ₹5,000 off (min ₹25,000)

## Project Structure

```
gemini-solariss/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & error handling
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── scripts/         # Database seeding
│   ├── utils/           # Utilities (invoice generation)
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store & slices
│   │   └── App.jsx      # Main app component
│   └── package.json
└── README.md
```

## Features Implemented

✅ User authentication (login, register, profile)
✅ Product catalog with search & filters
✅ Shopping cart
✅ Checkout process
✅ Order management
✅ PDF invoice generation
✅ Admin dashboard with analytics
✅ Coupon system
✅ Payment gateway integration (backend ready)
✅ Responsive design
✅ Company branding throughout

## Payment Gateway Setup

### Stripe
1. Sign up at https://stripe.com
2. Get test keys from Dashboard → Developers → API keys
3. Add to backend `.env`

### Razorpay
1. Sign up at https://razorpay.com
2. Get test keys from Dashboard → Settings → API Keys
3. Add to backend `.env`

### PayPal
1. Sign up at https://developer.paypal.com
2. Create sandbox app
3. Get Client ID and Secret
4. Add to backend `.env`

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in backend/.env
- Verify connection string format

### Port Already in Use
- Change PORT in backend/.env
- Or kill process using port 5000/5173

### CORS Errors
- Verify FRONTEND_URL in backend/.env matches frontend URL
- Check CORS configuration in server.js

## Production Deployment

1. Set NODE_ENV=production
2. Use strong JWT_SECRET (min 32 characters)
3. Configure production MongoDB
4. Set up payment gateway production keys
5. Build frontend: `cd frontend && npm run build`
6. Deploy backend to Heroku/Railway/AWS
7. Deploy frontend to Vercel/Netlify

## Support

For issues or questions, contact: admin@geminisolariss.com

