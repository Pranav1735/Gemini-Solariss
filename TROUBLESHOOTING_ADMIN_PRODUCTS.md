# Troubleshooting: Can't See "Add Product" Button

## Quick Checks

### 1. Are you logged in as Admin?
- Go to: http://localhost:5173/login
- Login with: `admin@geminisolariss.com` / `Admin@123`
- Check if you see "Admin" link in the header

### 2. Are you on the correct page?
- URL should be: http://localhost:5173/admin/products
- You should see "Product Management" as the heading

### 3. Check Browser Console
- Press F12 to open Developer Tools
- Look for any red error messages
- Check the Console tab for JavaScript errors

### 4. Check if page is loading
- You should see "Product Management" heading
- You should see a search box
- You should see a products table (or "No products found")

## If Button Still Not Visible

### Option 1: Direct URL
Try navigating directly to:
```
http://localhost:5173/admin/products
```

### Option 2: Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for failed requests (red)
5. Check if `/api/products` request is successful

### Option 3: Manual Test
Open browser console and type:
```javascript
// Check if you're logged in
localStorage.getItem('token')

// Check user role
// (This will show in Redux state if you have Redux DevTools)
```

## Alternative: Use Browser DevTools

1. Right-click on the page where the button should be
2. Select "Inspect Element"
3. Look for the button in the HTML
4. Check if it has `display: none` or is hidden

## Quick Fix: Try This

If the button still doesn't appear, the page might be showing an error. Check:

1. **Backend is running?**
   - Should see: `🚀 GEMINI SOLARISS Server running on port 5000`

2. **Frontend is running?**
   - Should see: `Local: http://localhost:5173/`

3. **Try refreshing the page** (Ctrl+F5 or Cmd+Shift+R)

4. **Clear browser cache** and try again

## Still Not Working?

The button code is definitely there. If you can't see it, please check:
- Browser console for errors
- Network tab for failed API calls
- Make sure you're logged in as admin
- Verify the URL is exactly: `/admin/products`

