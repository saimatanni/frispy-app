# Frispy App - Quick Start Guide

## Get Started in 3 Steps

### Step 1: Start the Development Server

```bash
npm start
```

This will start the Metro bundler and show you a QR code.

### Step 2: Run on Your Device

**Option A: Physical Device (Recommended for testing)**
1. Install **Expo Go** app from:
   - iOS: App Store
   - Android: Google Play Store
2. Scan the QR code shown in your terminal
3. The app will load on your device

**Option B: Emulator**
```bash
# For Android
npm run android

# For iOS (macOS only)
npm run ios

# For Web Browser
npm run web
```

### Step 3: Explore the App

The app has 4 main sections:

1. **Dashboard** - Overview of sales and inventory
2. **POS** - Point of Sale for creating orders
3. **Inventory** - Manage stock levels
4. **Sales** - View analytics and reports

## App Features Overview

### Dashboard Screen
- Today's sales summary
- Weekly and monthly revenue
- Low stock alerts
- Best selling items
- Quick metrics overview

**What to Try:**
- Pull down to refresh data
- Tap on stat cards to see details
- Check low stock alerts

### POS (Point of Sale) Screen
- Browse menu items by category
- Add items to cart
- Adjust quantities
- Complete sales

**What to Try:**
1. Tap a menu item to add to cart
2. Use category filters at the top
3. Tap "Checkout" to review order
4. Complete a sale

### Inventory Screen
- View all inventory items
- Adjust stock levels with +/- buttons
- Filter by stock status
- Search items
- Visual stock indicators

**What to Try:**
1. Use +/- buttons to adjust quantities
2. Filter by "Low Stock" to see items running low
3. Search for specific items
4. Watch the progress bars update

### Sales Screen
- Switch between Daily/Weekly/Monthly views
- View sales trends in charts
- See best-selling items
- Review recent transactions

**What to Try:**
1. Toggle between Today/Week/Month tabs
2. Scroll through best sellers
3. Check the sales trend chart
4. Review recent transactions

## Sample Data

The app comes pre-loaded with:
- **Menu Items**: 10 items (burgers, fries, drinks, nuggets)
- **Inventory**: 14 items with varying stock levels
- **Sales History**: 90 days of sample sales data

This data is stored locally on your device using AsyncStorage.

## Dark Theme

The entire app uses an attractive dark theme with:
- Orange primary color (#FF6B35)
- Dark background (#121212)
- High contrast for easy reading
- Material Design components

## Common Actions

### Add a Sale
1. Go to POS tab
2. Select items from menu
3. Tap "Checkout"
4. Review order
5. Tap "Complete Sale"

### Check Low Stock
1. Go to Dashboard
2. Look for warning banner
3. Tap "View" to see all low stock items
4. Or go to Inventory tab → Filter "Low Stock"

### Update Inventory
1. Go to Inventory tab
2. Find the item
3. Use +/- buttons to adjust quantity
4. Changes save automatically

### View Sales Reports
1. Go to Sales tab
2. Choose time period (Today/Week/Month)
3. View charts and metrics
4. Scroll to see best sellers

## Troubleshooting

### App won't load?
```bash
# Clear cache and restart
npm start -- --clear
```

### "Module not found" error?
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
npm start
```

### Slow performance?
- Close and reopen the app
- Make sure you're not running too many apps
- Try restarting the Expo server

### Data not showing?
- Pull down to refresh on any screen
- Data initializes on first launch
- Check console for errors

## App Structure

```
Frispy App
│
├── Dashboard          → Overview & Alerts
├── POS               → Create Sales
├── Inventory         → Manage Stock
└── Sales             → View Analytics
```

## Next Steps

1. **Explore**: Navigate through all screens
2. **Test**: Create some sales in POS
3. **Analyze**: Check how sales appear in analytics
4. **Manage**: Update inventory levels
5. **Customize**: Check README.md for customization options

## Tips

- **Refresh Data**: Pull down on any screen to refresh
- **Quick Actions**: Long press on items for more options (coming soon)
- **Navigation**: Use bottom tab bar to switch screens
- **Stock Alerts**: Dashboard shows immediate alerts for low stock
- **Best Performance**: Close background apps when testing

## Need Help?

- Check `README.md` for detailed documentation
- Check `ARCHITECTURE.md` for code structure
- Report issues in the project repository

## Development Mode Features

When running in development:
- Hot reload enabled (changes reflect immediately)
- Error overlay shows helpful messages
- Console logs visible in terminal
- Performance metrics available

---

Happy Testing! 🎉

Built for Frispy Fast Food Restaurant
