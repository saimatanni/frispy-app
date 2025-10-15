# Frispy App - Deployment Guide

## Deploy to Vercel (Recommended for Web)

### Method 1: Using Vercel Dashboard (Easiest)

1. **Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your Git repository (GitHub/GitLab/Bitbucket)
   - OR drag and drop the project folder

3. **Configure Build Settings** (Auto-detected from vercel.json)
   - Framework Preset: Other
   - Build Command: `expo export -p web`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Get your live URL: `https://frispy-app.vercel.app`

### Method 2: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # First deployment
   vercel

   # Production deployment
   vercel --prod
   ```

4. **Follow prompts:**
   - Set up and deploy? **Y**
   - Which scope? **Select your account**
   - Link to existing project? **N**
   - Project name? **frispy-app**
   - Directory? **./dist** (after build)

---

## Alternative: Expo Publish (For Mobile Preview)

### Quick Share via Expo Go App

1. **Start Expo**
   ```bash
   npm start
   ```

2. **Share QR Code**
   - Others can scan QR code with Expo Go app
   - Works on iOS and Android
   - No build required

3. **Publish to Expo**
   ```bash
   npx expo publish
   ```
   - Creates a permanent link
   - Anyone with Expo Go can access
   - URL: `exp://expo.dev/@yourusername/frispy-app`

---

## Option 3: Build Native Apps

### For Android (APK)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS**
   ```bash
   eas build:configure
   ```

3. **Build APK**
   ```bash
   eas build -p android --profile preview
   ```

4. **Download APK**
   - Share APK file with testers
   - They can install directly on Android devices

### For iOS (TestFlight)

1. **Build for iOS**
   ```bash
   eas build -p ios --profile preview
   ```

2. **Submit to TestFlight**
   ```bash
   eas submit -p ios
   ```

---

## Quick Start (Vercel Dashboard)

**Fastest way to get demo link:**

1. Push code to GitHub/GitLab
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"
6. Share the URL!

**Your app will be live at:** `https://frispy-app-[random].vercel.app`

---

## After Deployment

### Share Demo Link

**Web (Vercel):**
- URL: `https://frispy-app.vercel.app`
- Works on any device with browser
- Fully responsive (mobile, tablet, desktop)

**Mobile (Expo):**
- Share QR code or Expo URL
- Requires Expo Go app
- Best for native mobile experience

### Get Feedback

1. Share the live URL
2. Ask users to test on their devices
3. Collect feedback on:
   - UI/UX design
   - Responsiveness
   - Features functionality
   - Performance

---

## Troubleshooting

### Build fails on Vercel

- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify vercel.json configuration

### App looks different on web

- Some React Native components render differently on web
- Test responsiveness on different screen sizes
- Check browser console for errors

### Need help?

- Vercel Docs: https://vercel.com/docs
- Expo Docs: https://docs.expo.dev
- Deployment Support: Check Vercel support chat

---

## Current Configuration

✅ `vercel.json` - Configured for Expo web build
✅ `.vercelignore` - Excludes unnecessary files
✅ `package.json` - All dependencies listed
✅ Web build command: `expo export -p web`
✅ Output directory: `dist`

**You're ready to deploy! 🚀**
