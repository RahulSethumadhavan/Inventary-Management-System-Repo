# 🐘 Supabase PostgreSQL Setup Guide

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click **"Start your project"** or **"New Project"**
3. Sign up/Login with GitHub (recommended)
4. Click **"New Project"**
5. Fill in:
   - **Name:** `inventory-management`
   - **Database Password:** Choose a strong password (save this!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free (includes PostgreSQL)
6. Click **"Create new project"**
7. Wait 2-3 minutes for project to be ready

---

## Step 2: Get Database Connection String

1. In your Supabase project dashboard, click **"Settings"** (gear icon, bottom left)
2. Click **"Database"** in the left menu
3. Scroll down to **"Connection string"** section
4. Select **"URI"** tab
5. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with the password you created in Step 1

**Example:**
```
postgresql://postgres:mySecretPass123@db.abcdefgh.supabase.co:5432/postgres
```

---

## Step 3: Add to Vercel Backend

### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click on your **backend project** (e.g., `inventory-backend`)
3. Go to **"Settings"** tab
4. Click **"Environment Variables"** in left menu
5. Click **"Add New"**
6. Add:
   - **Key:** `DATABASE_URL`
   - **Value:** `postgresql://postgres:yourPassword@db.xxx.supabase.co:5432/postgres`
   - **Environments:** Check all (Production, Preview, Development)
7. Click **"Save"**
8. Go to **"Deployments"** tab
9. Click **"Redeploy"** on the latest deployment

### Option B: Via Terminal (Alternative)

```powershell
# Install Vercel CLI if not already installed
npm install -g vercel

# Navigate to backend
cd "C:\Users\91897\Pictures\Personal\Inventary Management System\inventory-management-app\backend"

# Login to Vercel
vercel login

# Add environment variable
vercel env add DATABASE_URL

# When prompted, paste your Supabase connection string
# Select: Production, Preview, Development (all)

# Redeploy
vercel --prod
```

---

## Step 4: Verify Database Tables

1. Go back to Supabase dashboard
2. Click **"Table Editor"** (left sidebar)
3. After Vercel redeploys, refresh the page
4. You should see two tables:
   - ✅ `products`
   - ✅ `inventory_history`

If tables don't appear, check Vercel logs for errors.

---

## Step 5: Test Your Deployment

1. Open your Vercel backend URL in browser:
   ```
   https://your-backend.vercel.app/api/products
   ```
2. You should see: `[]` (empty array)
3. This means it's working!

---

## Step 6: Update Frontend Environment Variable

1. Go to Vercel dashboard
2. Click on your **frontend project** (e.g., `inventory-frontend`)
3. Go to **"Settings"** → **"Environment Variables"**
4. Update `REACT_APP_API_URL`:
   - **Value:** `https://your-backend.vercel.app/api/products`
5. Click **"Save"**
6. Go to **"Deployments"** → Click **"Redeploy"**

---

## 🎉 You're Done!

Your app is now live with:
- ✅ Backend on Vercel with PostgreSQL (Supabase)
- ✅ Frontend on Vercel
- ✅ Persistent database storage

**Test your live app:**
```
Frontend: https://your-frontend.vercel.app
Backend API: https://your-backend.vercel.app/api/products
```

---

## 🔒 Security Tips

1. **Never commit** your database password to GitHub
2. **Use environment variables** for sensitive data
3. **Enable Row Level Security (RLS)** in Supabase for production:
   - Go to Supabase → Authentication → Policies
   - Add policies to protect your tables

---

## 🐛 Troubleshooting

### "relation 'products' does not exist"
- Tables weren't created. Check Vercel logs.
- Redeploy backend after adding DATABASE_URL.

### "password authentication failed"
- Wrong password in connection string.
- Verify password in Supabase Settings → Database.

### "SSL connection required"
- Connection string should include `?sslmode=require` or app handles it (already done).

### Backend returns 500 errors
- Check Vercel logs: Go to project → "Logs" tab
- Look for database connection errors

---

## 📝 Connection String Format

```
postgresql://postgres:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

**Example:**
```
postgresql://postgres:abc123XYZ@db.projectref.supabase.co:5432/postgres
```

---

## 🚀 Next Steps

After deployment:
1. Import sample data via frontend
2. Test CRUD operations
3. Check Supabase Table Editor to see live data
4. Share your live link!

**Need help?** Let me know if any step fails!
