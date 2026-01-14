# PostgreSQL Migration Guide

The database has been migrated from MongoDB to PostgreSQL using Sequelize ORM.

## Changes Made

1. **Package Dependencies:**
   - Removed: `mongoose`
   - Added: `sequelize`, `pg`, `pg-hstore`

2. **Database Configuration:**
   - New file: `backend/config/database.js`
   - Uses Sequelize to connect to PostgreSQL

3. **Models:**
   - All models converted from Mongoose to Sequelize
   - Models now use UUIDs instead of MongoDB ObjectIds
   - Associations defined in `backend/models/index.js`

4. **Controllers:**
   - Updated to use Sequelize query methods:
     - `findOne({ where: { field } })` instead of `findOne({ field })`
     - `findByPk(id)` instead of `findById(id)`
     - `user.update()` instead of `findByIdAndUpdate()`
     - `user.id` instead of `user._id`

## Setup Instructions

### 1. Install PostgreSQL

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Install with default settings
- Remember the postgres user password you set

**Or use Docker:**
```bash
docker run --name postgres-gemini -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=gemini_solariss -p 5432:5432 -d postgres
```

### 2. Create Database

```sql
CREATE DATABASE gemini_solariss;
```

Or using psql:
```bash
psql -U postgres
CREATE DATABASE gemini_solariss;
\q
```

### 3. Update .env File

Update `backend/.env`:
```env
# PostgreSQL Configuration
DB_NAME=gemini_solariss
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
```

### 4. Install Dependencies

```bash
cd backend
npm install
```

### 5. Run Migrations

The database tables will be created automatically when you start the server (in development mode).

### 6. Seed Database

```bash
npm run seed
```

### 7. Start Server

```bash
npm start
```

## Model Changes

- **User**: Uses UUID, password hashing in hooks
- **Product**: JSONB for technicalSpecs and dimensions
- **Order**: JSONB for shippingAddress
- **Cart**: Separate CartItem model for many-to-many relationship
- **OrderItem**: Separate model for order items

## Query Differences

### Finding Records
```javascript
// Old (Mongoose)
User.findById(id)
User.findOne({ email })

// New (Sequelize)
User.findByPk(id)
User.findOne({ where: { email } })
```

### Updating Records
```javascript
// Old (Mongoose)
User.findByIdAndUpdate(id, data, { new: true })

// New (Sequelize)
const user = await User.findByPk(id)
await user.update(data)
```

### Associations
```javascript
// Old (Mongoose)
Product.find().populate('category')

// New (Sequelize)
Product.findAll({ include: [{ model: Category, as: 'category' }] })
```

## Troubleshooting

### Connection Error
- Verify PostgreSQL is running
- Check DB credentials in .env
- Ensure database exists

### Table Creation Issues
- Check PostgreSQL user has CREATE privileges
- Verify database name is correct

### Migration Issues
- Tables are auto-created on first run
- Use `sequelize.sync({ force: true })` to drop and recreate (development only)

