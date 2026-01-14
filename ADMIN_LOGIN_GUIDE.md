# Admin Login Guide

## Admin Portal Access

Admins now have a dedicated login page at: **`http://localhost:5173/admin`**

### How to Access Admin Dashboard

1. **Go to Admin Login Page:**
   - Navigate to: `http://localhost:5173/admin`
   - Or click "Admin" link in the header (if logged in as admin)

2. **Login Credentials:**
   - **Email:** `admin@geminisolariss.com`
   - **Password:** `Admin@123`

3. **After Login:**
   - You'll be automatically redirected to `/admin/dashboard`
   - From there, you can access all admin features:
     - Dashboard (overview)
     - Products (manage products)
     - Orders (manage orders)
     - Users (manage users)
     - Coupons (manage coupons)

### Features

✅ **Dedicated Admin Login Page**
- Beautiful gradient background
- Professional admin portal design
- Logo and branding
- Clear admin-only messaging

✅ **Automatic Redirects**
- Admins logging in from `/login` → Redirected to `/admin/dashboard`
- Admins logging in from `/admin` → Redirected to `/admin/dashboard`
- Non-admin users trying to access `/admin` → Access denied

✅ **Security**
- Only admin users can access admin routes
- Non-admin users are automatically logged out if they try to use admin credentials
- Protected routes require admin role

### Admin Routes

All admin routes are protected and require admin authentication:

- `/admin` - Admin login page (public)
- `/admin/dashboard` - Admin dashboard (protected)
- `/admin/products` - Product management (protected)
- `/admin/orders` - Order management (protected)
- `/admin/users` - User management (protected)
- `/admin/coupons` - Coupon management (protected)

### Navigation

Once logged in as admin:
- Click your name in the header → See "Admin Dashboard" in dropdown
- Or navigate directly to `/admin/dashboard`
- All admin features are accessible from the dashboard

### Customer Login

Regular customers should use:
- `/login` - Customer login page
- They will be redirected to home page after login
- If they try to access `/admin`, they'll see an access denied message

