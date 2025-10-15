# Frispy - Fast Food Inventory & POS App

A modern, professional React Native mobile application for managing fast food restaurant operations, built with Expo.

## Features

### Point of Sale (POS)
- Browse menu items by category
- Add items to cart with quantity management
- Complete orders and process sales
- Real-time cart updates

### Inventory Management
- Track inventory levels in real-time
- Low stock alerts and notifications
- Quick quantity adjustments with +/- controls
- Filter by stock status (All, Low Stock, In Stock)
- Search inventory items
- Visual stock indicators and progress bars

### Sales Analytics
- Daily, weekly, and monthly sales reports
- Revenue tracking and order statistics
- Best-selling items analysis
- Sales trend charts
- Recent transaction history
- Average order value calculations

### Dashboard
- Quick overview of key metrics
- Today's sales summary
- Low stock alerts
- Best sellers of the day
- Inventory status at a glance

## Tech Stack

### Core Technologies
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tooling
- **React Navigation** - Navigation and routing
- **React Native Paper** - Material Design UI components
- **AsyncStorage** - Local data persistence

### Architecture & Best Practices
- **Custom Hooks** - Reusable business logic (useInventory, useSales, useMenu)
- **Context API** - Global state management
- **Memoization** - Performance optimization with useMemo and useCallback
- **Component Library** - Reusable UI components (StatCard, AlertBanner, etc.)
- **Separation of Concerns** - Clean folder structure

## Project Structure

```
frispy-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared components (StatCard, MenuItem, etc.)
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── pos/             # POS-specific components
│   │   ├── inventory/       # Inventory-specific components
│   │   └── sales/           # Sales-specific components
│   ├── context/             # Context providers for global state
│   │   └── AppContext.js
│   ├── data/                # Data management and storage
│   │   └── store.js         # AsyncStorage operations
│   ├── hooks/               # Custom React hooks
│   │   ├── useInventory.js
│   │   ├── useSales.js
│   │   └── useMenu.js
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.js
│   ├── screens/             # Main app screens
│   │   ├── DashboardScreen.js
│   │   ├── POSScreen.js
│   │   ├── InventoryScreen.js
│   │   └── SalesScreen.js
│   ├── theme/               # Theme and styling
│   │   └── theme.js
│   └── utils/               # Utility functions
│       └── analytics.js
├── App.js                   # Main app entry point
├── app.json                 # Expo configuration
└── package.json             # Dependencies
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Expo CLI (optional, recommended)

### Steps

1. **Navigate to project directory**
   ```bash
   cd frispy-app
   ```

2. **Install dependencies** (if not already installed)
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   npx expo start
   ```

4. **Run on your device**
   - Install **Expo Go** app on your iOS or Android device
   - Scan the QR code from the terminal

   Or run on emulators:
   ```bash
   npm run android   # Android emulator
   npm run ios       # iOS simulator (macOS only)
   npm run web       # Web browser
   ```

## Sample Data

The app comes with pre-populated sample data including:
- 10 menu items (burgers, fries, drinks, etc.)
- 14 inventory items with stock levels
- 90 days of sample sales data for testing analytics

To reset data, you can clear the app's storage from device settings.

## Dark Theme

The app features a modern dark theme with:
- **Primary Color**: Vibrant Orange (#FF6B35) - Fast food energy
- **Secondary Color**: Golden Yellow (#FFD23F) - Accent
- **Tertiary Color**: Teal (#4ECDC4) - Fresh look
- **Background**: Deep dark (#121212)
- **Surface**: Card background (#1E1E1E)

## Performance Optimizations

- **Memoization**: Uses `useMemo` and `useCallback` to prevent unnecessary re-renders
- **Component Optimization**: All components wrapped with `React.memo`
- **Efficient Filtering**: Optimized data filtering and searching
- **Lazy Loading**: Components load data only when needed
- **AsyncStorage**: Fast local data persistence

## Future Enhancements

- [ ] Barcode scanning for inventory items
- [ ] Multi-location support
- [ ] Cloud sync with backend API
- [ ] Employee management
- [ ] Custom reports export (PDF, Excel)
- [ ] Receipt printing
- [ ] Payment integration
- [ ] Customer loyalty program
- [ ] Push notifications for low stock
- [ ] Dark/Light theme toggle

## Development

### Adding New Menu Items
Edit `src/data/store.js` and modify the `sampleMenuItems` array.

### Adding New Inventory Items
Edit `src/data/store.js` and modify the `sampleInventory` array.

### Customizing Theme
Edit `src/theme/theme.js` to change colors, spacing, or fonts.

## Troubleshooting

### Metro Bundler Issues
```bash
npx expo start -c
```

### Clear Cache
```bash
npm start -- --reset-cache
```

### Rebuild Dependencies
```bash
rm -rf node_modules
npm install
```

## License

This project is created for Frispy fast-food restaurant.

## Support

For issues or questions, please create an issue in the project repository.

---

Built with ❤️ using React Native and Expo
