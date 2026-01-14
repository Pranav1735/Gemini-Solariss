# Admin Product Management Guide

## Features Implemented

✅ **View All Products** - See all products in a table with search functionality
✅ **Add New Products** - Complete form to add new solar products
✅ **Edit Products** - Update existing product information
✅ **Delete Products** - Soft delete (deactivates product)
✅ **Activate/Deactivate** - Toggle product visibility
✅ **Product Status** - See active/inactive and featured status
✅ **Stock Management** - View and manage product stock levels

## How to Use

### Accessing Product Management

1. Login as admin: `admin@geminisolariss.com` / `Admin@123`
2. Navigate to Admin Dashboard
3. Click on "Products" in the admin menu
4. Or go directly to: http://localhost:5173/admin/products

### Adding a New Product

1. Click the **"Add Product"** button
2. Fill in the product form:
   - **Basic Information**: Name, category, brand, type, descriptions
   - **Pricing & Inventory**: Price, compare price, stock
   - **Solar Specifications**: Wattage, efficiency, weight
   - **Dimensions**: Length, width, height, unit
   - **Warranty**: Period and unit (years/months)
   - **Images**: Comma-separated image URLs
   - **Settings**: Active status, featured status
3. Click **"Create Product"**

### Editing a Product

1. Find the product in the table
2. Click the **Edit** icon (pencil)
3. Modify any fields
4. Click **"Update Product"**

### Managing Product Status

- **Activate/Deactivate**: Click the eye icon to toggle visibility
- **Delete**: Click the delete icon (trash) to soft delete
- **Featured**: Toggle in the edit form

### Product Form Fields

**Required Fields:**
- Product Name
- Category
- Type
- Description
- Price
- Stock
- Wattage

**Optional Fields:**
- Brand
- Short Description
- Compare At Price
- Efficiency
- Weight
- Dimensions
- Warranty
- Images
- Technical Specs

## Product Types

- **Residential** - For home use
- **Commercial** - For business use
- **On-Grid** - Grid-tied systems
- **Off-Grid** - Standalone systems
- **Hybrid** - Combined systems

## Tips

- Use clear, descriptive product names
- Add high-quality product images
- Set appropriate stock levels
- Mark popular products as "Featured"
- Keep descriptions detailed but readable
- Use compare price to show discounts

## Troubleshooting

**Product not saving?**
- Check all required fields are filled
- Verify category exists
- Ensure price and stock are valid numbers

**Can't see product?**
- Check if product is "Active"
- Verify it's not soft-deleted

**Images not showing?**
- Ensure image URLs are valid and accessible
- Use full URLs (https://...)
- Separate multiple URLs with commas

