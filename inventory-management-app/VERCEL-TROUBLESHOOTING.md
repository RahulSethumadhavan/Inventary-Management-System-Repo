# 🔧 Vercel White Screen Fix Guide

## Common Causes & Solutions

### 1. Missing Environment Variable (Most Common)

**Problem:** Frontend can't connect to backend API.

**Solution:**
1. Go to Vercel → Your Frontend Project → Settings → Environment Variables
2. Add or verify:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://your-backend-url.vercel.app/api/products`
3. **Important:** Select all environments (Production, Preview, Development)
4. Go to Deployments → Redeploy latest deployment

---

### 2. Build Configuration Issue

**Problem:** Vercel isn't building the React app correctly.

**Solution:**
1. Go to Vercel → Your Frontend Project → Settings → General
2. Verify:
   - **Framework Preset:** `Create React App`
   - **Root Directory:** `inventory-management-app/frontend`
   - **Build Command:** `npm run build` (or leave empty for auto-detect)
   - **Output Directory:** `build`
   - **Install Command:** `npm install` (or leave empty)

---

### 3. Routing Issue (SPA)

**Problem:** Routes don't work after refresh.

**Solution:** Already fixed in `vercel.json` - all routes redirect to `/index.html`

---

### 4. Backend Not Deployed Yet

**Problem:** Backend returns errors or isn't deployed.

**Solution:**
1. Deploy backend FIRST
2. Get backend URL
3. Then deploy frontend with correct `REACT_APP_API_URL`

---

## 🚀 Redeploy Steps

After making changes:

### Option A: Via Vercel Dashboard
1. Go to your project → **Deployments** tab
2. Click the three dots `...` on latest deployment
3. Click **Redeploy**
4. Wait for build to complete
5. Check the deployment URL

### Option B: Git Push (Automatic)
```powershell
cd "C:\Users\91897\Pictures\Personal\Inventary Management System\inventory-management-app"
git add .
git commit -m "Fix white screen - update config"
git push
```
Vercel will auto-deploy on push.

---

## 🔍 Check Deployment Logs

1. Go to Vercel → Your Project → **Deployments**
2. Click on the latest deployment
3. Check:
   - **Building** - Look for errors in build logs
   - **Function Logs** - Look for runtime errors
   - **Output** - Check if files were generated

**Common errors in logs:**
- `Module not found` → Missing dependency
- `Failed to compile` → Code syntax error
- `ECONNREFUSED` → Can't connect to backend

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Frontend URL loads (not white screen)
- [ ] Browser console has no errors (F12 → Console)
- [ ] Network tab shows API calls (F12 → Network)
- [ ] Backend URL/api/products returns `[]` or data
- [ ] Environment variables are set correctly

---

## 🐛 Debug in Browser Console

1. Open your Vercel frontend URL
2. Press **F12** → **Console** tab
3. Look for errors:

**If you see:**
```
Failed to fetch
```
→ Backend URL is wrong or backend isn't deployed

**If you see:**
```
Uncaught SyntaxError
```
→ Build issue - check Vercel build logs

**If you see:**
```
Cannot read property of undefined
```
→ Data structure issue - backend might be returning unexpected format

---

## 🔧 Quick Fix Script

If all else fails, try this:

```powershell
# Navigate to frontend
cd "C:\Users\91897\Pictures\Personal\Inventary Management System\inventory-management-app\frontend"

# Clear cache and rebuild
Remove-Item -Recurse -Force node_modules, build
npm install
npm run build

# Test locally first
npm start
```

If it works locally but not on Vercel → Environment variable issue.

---

## 📞 Still White Screen?

Check these in order:

1. **Vercel Build Logs** - Look for build errors
2. **Browser Console** - Press F12, check Console tab
3. **Network Tab** - Check if API calls are made
4. **Environment Variables** - Verify `REACT_APP_API_URL` is set
5. **Backend Status** - Test backend URL directly in browser

**Share with me:**
- Vercel deployment URL
- Browser console errors (screenshot)
- Vercel build log errors

And I'll help debug further!
