# PostgreSQL Password Setup

The error "password authentication failed" means the password in your `.env` file doesn't match your PostgreSQL password.

## How to Fix

### Step 1: Find Your PostgreSQL Password

**If you installed PostgreSQL locally:**
- Remember the password you set during installation
- Or check if you used the default (often empty or "postgres")

**If you're using Docker:**
- The password is what you set with `-e POSTGRES_PASSWORD=`
- Default in our guide was `postgres`

### Step 2: Update backend/.env

Open `D:\Geminisolariss\backend\.env` and update this line:

```env
DB_PASSWORD=your_actual_postgres_password
```

Replace `your_actual_postgres_password` with your real PostgreSQL password.

### Step 3: Test Connection

Try running the seed script again:
```powershell
cd D:\Geminisolariss\backend
npm run seed
```

## Common Passwords to Try

- `postgres` (common default)
- Empty password (leave it blank: `DB_PASSWORD=`)
- The password you set during PostgreSQL installation

## If You Forgot Your Password

**Windows (Local PostgreSQL):**
1. Open Services (services.msc)
2. Find "postgresql" service
3. Stop the service
4. Edit `pg_hba.conf` file (usually in `C:\Program Files\PostgreSQL\XX\data\`)
5. Change `md5` to `trust` for local connections
6. Restart PostgreSQL service
7. Connect with psql and reset password:
   ```sql
   ALTER USER postgres PASSWORD 'newpassword';
   ```
8. Change `trust` back to `md5` in pg_hba.conf
9. Restart service again

**Docker:**
Just recreate the container with a known password:
```powershell
docker stop postgres-gemini
docker rm postgres-gemini
docker run --name postgres-gemini -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=gemini_solariss -p 5432:5432 -d postgres
```

## Quick Test

You can test your PostgreSQL connection with:
```powershell
# Using psql (if installed)
psql -U postgres -d gemini_solariss

# Or using Docker exec
docker exec -it postgres-gemini psql -U postgres -d gemini_solariss
```

If it asks for a password, enter it. If it connects successfully, use that password in your `.env` file.

