# Quick Start Guide - GEMINI SOLARISS

## Prerequisites

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/windows/)
3. **npm** (comes with Node.js)

## Step-by-Step Setup

### 1. Install PostgreSQL

**Option A: Install PostgreSQL Locally**
- Download from: https://www.postgresql.org/download/windows/
- Run installer, remember the password you set for `postgres` user
- Default port: 5432

**Option B: Use Docker (Easier)**
```powershell
docker run --name postgres-gemini -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=gemini_solariss -p 5432:5432 -d postgres
```

### 2. Create Database

**If using local PostgreSQL:**
```powershell
# Open psql (search for "SQL Shell" in Start Menu)
# Or use pgAdmin GUI

# In psql, run:
CREATE DATABASE gemini_solariss;
\q
```

**If using Docker:**
Database is already created with name `gemini_solariss`

### 3. Install Dependencies

```powershell
# From project root
cd D:\Geminisolariss

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Configure Environment Variables

**Backend (.env):**
```powershell
cd D:\Geminisolariss\backend
```

The `.env` file should already exist. If not, create it with:
```env
PORT=5000
NODE_ENV=development

# PostgreSQL - Update password if different
DB_NAME=gemini_solariss
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET=gemini-solariss-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRE=7d

# Payment Gateways (Optional)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MODE=sandbox

FRONTEND_URL=http://localhost:5173
```

**Frontend (.env):**
```powershell
cd D:\Geminisolariss\frontend
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_RAZORPAY_KEY_ID=
```

### 5. Seed the Database

```powershell
cd D:\Geminisolariss\backend
npm run seed
```

You should see:
```
PostgreSQL Connected for seeding...
Database synchronized...
Cleared existing data...
✓ Admin user created
✓ Test customer created
✓ Categories created
✓ Products created
✓ Coupons created

✅ Database seeded successfully!
```

### 6. Start the Application

**Option A: Run Both Together (Recommended)**
```powershell
# From project root
cd D:\Geminisolariss
npm run dev
```

**Option B: Run Separately**

**Terminal 1 - Backend:**
```powershell
cd D:\Geminisolariss\backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd D:\Geminisolariss\frontend
npm run dev
```

### 7. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## Default Login Credentials

- **Admin:** admin@geminisolariss.com / Admin@123
- **Customer:** customer@test.com / Customer@123

## Sample Coupons

- **WELCOME10:** 10% off (min ₹10,000)
- **SOLAR2024:** 15% off solar panels (min ₹50,000)
- **FLAT5000:** ₹5,000 off (min ₹25,000)

## Troubleshooting

### PostgreSQL Connection Error

**Error:** `connect ECONNREFUSED` or `password authentication failed`

**Solutions:**
1. Verify PostgreSQL is running:
   ```powershell
   # Check if PostgreSQL service is running
   Get-Service postgresql*
   ```

2. Check password in `.env` matches your PostgreSQL password

3. Verify database exists:
   ```sql
   -- In psql
   \l
   -- Should see gemini_solariss in the list
   ```

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solutions:**
1. Change PORT in `backend/.env` to another port (e.g., 5001)
2. Or kill the process using the port:
   ```powershell
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

### Module Not Found

**Error:** `Cannot find module 'sequelize'`

**Solution:**
```powershell
cd backend
npm install
```

### Database Tables Not Created

**Solution:**
The tables are auto-created on first server start. If they're not:
```powershell
cd backend
# Start server once, it will create tables
npm start
```

## Development Commands

```powershell
# Backend
cd backend
npm start          # Start production server
npm run dev        # Start with nodemon (auto-restart)
npm run seed       # Seed database

# Frontend
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Next Steps

1. ✅ Database is seeded
2. ✅ Backend is running
3. ✅ Frontend is running
4. 🎉 Start using the application!

Visit http://localhost:5173 and start exploring!

