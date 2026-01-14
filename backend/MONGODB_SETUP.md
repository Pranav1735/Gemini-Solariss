# MongoDB Setup Guide

## Option 1: Local MongoDB (Recommended for Development)

### Install MongoDB on Windows

1. **Download MongoDB Community Server:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows platform
   - Download and run the installer

2. **Install MongoDB:**
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (optional GUI tool)

3. **Start MongoDB:**
   - MongoDB should start automatically as a Windows service
   - Or start manually: Open Services (services.msc) and start "MongoDB"

4. **Verify Installation:**
   ```powershell
   # Open a new PowerShell window
   mongod --version
   ```

5. **Update .env file:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/gemini-solariss
   ```

## Option 2: MongoDB Atlas (Cloud - Free Tier Available)

1. **Create Account:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select a cloud provider and region
   - Click "Create"

3. **Create Database User:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set user privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Or add your specific IP address for production
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `gemini-solariss`

6. **Update .env file:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gemini-solariss?retryWrites=true&w=majority
   ```

## Option 3: Docker (If you have Docker installed)

```powershell
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Update .env file
MONGODB_URI=mongodb://localhost:27017/gemini-solariss
```

## Verify Connection

After setting up MongoDB, test the connection:

```powershell
cd backend
npm run seed
```

If successful, you should see:
```
MongoDB Connected for seeding...
✓ Admin user created
✓ Test customer created
✓ Categories created
✓ Products created
✓ Coupons created
```

## Troubleshooting

### Error: connect ECONNREFUSED
- **MongoDB not running:** Start MongoDB service or check if it's running
- **Wrong connection string:** Verify MONGODB_URI in .env file
- **Firewall blocking:** Check Windows Firewall settings

### Error: Authentication failed
- **MongoDB Atlas:** Verify username and password in connection string
- **IP not whitelisted:** Add your IP to MongoDB Atlas Network Access

### Error: The `uri` parameter to `openUri()` must be a string
- **Missing .env file:** Ensure `.env` file exists in backend directory
- **Wrong variable name:** Check that MONGODB_URI is spelled correctly in .env

## Quick Start (Local MongoDB)

1. Install MongoDB Community Server
2. Ensure MongoDB service is running
3. Create `.env` file in backend directory (already created)
4. Run: `npm run seed`

