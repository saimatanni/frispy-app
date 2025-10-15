# GitHub CLI & Vercel CLI Setup Guide

## ✅ GitHub CLI - Already Connected!

**Status:** Logged in as `saimatanni`

### Current GitHub Configuration
- Account: `saimatanni`
- Protocol: HTTPS
- Token Scopes: gist, read:org, repo, workflow

### Useful GitHub CLI Commands

```bash
# Check status
gh auth status

# View your repos
gh repo list

# Create a new repo
gh repo create frispy-app --public --source=. --remote=origin

# Push code to GitHub
git add .
git commit -m "Initial commit"
git push origin master
```

---

## 🚀 Vercel CLI Setup

### Method 1: Using npx (No Installation Required) - RECOMMENDED

You can use Vercel CLI without installing it globally:

```bash
# Login to Vercel
npx vercel login

# Deploy (first time)
npx vercel

# Deploy to production
npx vercel --prod
```

### Method 2: Install Locally in Project

```bash
# Install as dev dependency
npm install --save-dev vercel

# Login
npx vercel login

# Deploy
npx vercel

# Production deploy
npx vercel --prod
```

---

## 📦 Quick Deployment Steps

### Step 1: Connect GitHub (✅ Done!)

You're already connected as `saimatanni`

### Step 2: Initialize Git Repository

```bash
# Check if git is initialized
git status

# If not initialized, run:
git init
git add .
git commit -m "Initial Frispy app commit"
```

### Step 3: Create GitHub Repository

```bash
# Option A: Using GitHub CLI
gh repo create frispy-app --public --source=. --remote=origin --push

# Option B: Manual
# 1. Go to github.com
# 2. Click "New Repository"
# 3. Name it "frispy-app"
# 4. Click "Create Repository"
# 5. Follow the push instructions
```

### Step 4: Connect Vercel

```bash
# Login to Vercel (opens browser)
npx vercel login

# Follow browser prompts:
# 1. Choose login method (GitHub, GitLab, Bitbucket, Email)
# 2. Authorize Vercel
# 3. Return to terminal
```

### Step 5: Deploy to Vercel

```bash
# First deployment (preview)
npx vercel

# Answer prompts:
# - Set up and deploy? → Y
# - Which scope? → Select your account
# - Link to existing project? → N
# - What's your project's name? → frispy-app
# - In which directory is your code? → ./
# - Want to override settings? → N

# Deploy to production
npx vercel --prod
```

---

## 🔐 Vercel Login Methods

When you run `npx vercel login`, you'll see these options:

### Option 1: Continue with GitHub (Recommended)
- Uses your existing GitHub account
- Quick OAuth flow
- Automatic repository linking

### Option 2: Continue with GitLab
- For GitLab users

### Option 3: Continue with Bitbucket
- For Bitbucket users

### Option 4: Continue with Email
- Enter your email
- Receive verification code
- Enter code to authenticate

**Choose GitHub** since you're already logged in!

---

## 📋 Complete Workflow

### Deploy Frispy App to Vercel

```bash
# 1. Check GitHub connection
gh auth status

# 2. Initialize git (if not done)
git init

# 3. Create .gitignore (if needed)
echo "node_modules" >> .gitignore
echo ".expo" >> .gitignore
echo "dist" >> .gitignore

# 4. Commit all changes
git add .
git commit -m "Ready for deployment - Frispy POS App"

# 5. Create GitHub repo and push
gh repo create frispy-app --public --source=. --remote=origin --push

# 6. Login to Vercel
npx vercel login

# 7. Deploy to Vercel
npx vercel --prod
```

---

## 🎯 Alternative: Deploy via Vercel Dashboard

If you prefer using the web interface:

### Step 1: Push to GitHub
```bash
# Create repo and push
gh repo create frispy-app --public --source=. --remote=origin --push
```

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Click "Continue with GitHub"
4. Authorize Vercel to access GitHub
5. Select "frispy-app" repository
6. Click "Import"
7. Settings will be auto-detected from `vercel.json`
8. Click "Deploy"

### Step 3: Get Your URL
- Preview: `https://frispy-app-git-master-saimatanni.vercel.app`
- Production: `https://frispy-app.vercel.app`

---

## 🔧 Troubleshooting

### GitHub CLI Issues

```bash
# Re-login if needed
gh auth logout
gh auth login

# Choose:
# - GitHub.com
# - HTTPS
# - Authenticate via browser
```

### Vercel CLI Issues

```bash
# Clear Vercel auth
rm -rf ~/.vercel

# Login again
npx vercel login

# If build fails, check logs
npx vercel logs
```

---

## 📊 After Deployment

### View Deployment

```bash
# Open current deployment in browser
npx vercel --open

# View deployment logs
npx vercel logs

# List all deployments
npx vercel ls
```

### Share with Others

Your app will be accessible at:
- **Production URL:** `https://frispy-app.vercel.app`
- **Preview URLs:** Generated for each git push
- **Custom Domain:** Can be added in Vercel dashboard

---

## 🎉 Next Steps

1. ✅ GitHub CLI is connected
2. ⏳ Login to Vercel: `npx vercel login`
3. ⏳ Deploy: `npx vercel --prod`
4. ✨ Share the URL with your team
5. 📝 Collect feedback

---

## Quick Reference

```bash
# GitHub Commands
gh auth status              # Check login
gh repo list               # List repos
gh repo create             # Create new repo

# Vercel Commands
npx vercel login           # Login to Vercel
npx vercel                 # Deploy preview
npx vercel --prod          # Deploy production
npx vercel ls              # List deployments
npx vercel logs            # View logs
npx vercel --open          # Open in browser

# Git Commands
git status                 # Check status
git add .                  # Stage all files
git commit -m "message"    # Commit changes
git push origin master     # Push to GitHub
```

---

**You're ready to deploy! 🚀**

Run: `npx vercel login` to get started!
