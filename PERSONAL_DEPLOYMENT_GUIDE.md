# Deploy Frispy App to Personal Vercel Account

## Problem
- GitHub repo is on your personal account (saimatanni) ✅
- But Vercel CLI keeps deploying to hiublue team ❌
- You want personal projects separate from work team

## Solution: Create Personal Vercel Account

### Option 1: Use Different Email for Vercel

**Step 1: Create new Vercel account**
1. Go to https://vercel.com/signup
2. Click **"Continue with Email"** (NOT GitHub)
3. Use your **personal email** (not work email)
4. Verify email

**Step 2: Connect GitHub**
1. After login, go to https://vercel.com/account
2. Click "Connected Accounts"
3. Connect your GitHub (saimatanni)
4. Authorize Vercel

**Step 3: Deploy**
1. Go to https://vercel.com/new
2. Select your GitHub repository: `saimatanni/frispy-app`
3. Click "Import"
4. Click "Deploy"

---

### Option 2: Use Netlify Instead (Easier)

Netlify doesn't have team issues like Vercel. Here's how:

**Step 1: Install Netlify CLI**
```bash
npm install -g netlify-cli
```

**Step 2: Login**
```bash
netlify login
```

**Step 3: Deploy**
```bash
# Build your app first
npx expo export -p web

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

Your site will be live at: `https://frispy-app.netlify.app`

---

### Option 3: GitHub Pages (Free, Easy)

**Step 1: Install gh-pages**
```bash
npm install --save-dev gh-pages
```

**Step 2: Add deploy script to package.json**
```json
{
  "scripts": {
    "predeploy": "expo export -p web",
    "deploy": "gh-pages -d dist"
  }
}
```

**Step 3: Deploy**
```bash
npm run deploy
```

Your site will be live at: `https://saimatanni.github.io/frispy-app`

---

## Why This Happened

**Your GitHub account structure:**
- Personal account: `saimatanni` ✅
- Personal repo: `saimatanni/frispy-app` ✅
- Member of: hiublue organization (work)

**Vercel behavior:**
- When you login with GitHub OAuth
- Vercel sees: "saimatanni is member of hiublue team"
- Defaults to deploying under hiublue team
- To avoid this: Use email login for Vercel

---

## Recommended: Use Netlify

Since Vercel has team complications, I recommend **Netlify** for personal projects:

**Advantages:**
- No team conflicts
- Free tier is generous
- Easy to use
- Automatic deploys from GitHub
- Custom domains free

**Quick Netlify Setup:**
1. Go to https://app.netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import from Git"
4. Select `saimatanni/frispy-app`
5. Build command: `expo export -p web`
6. Publish directory: `dist`
7. Deploy!

---

## Summary

✅ Your GitHub repo is YOURS (saimatanni/frispy-app)
❌ Vercel keeps using hiublue team
✅ Solution: Use Netlify OR create separate Vercel account with email

**Next Step:** Would you like to deploy to Netlify instead?
