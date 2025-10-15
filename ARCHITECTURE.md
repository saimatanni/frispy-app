# Frispy App - Architecture Guide

## Overview

This document explains the architecture, design patterns, and best practices used in the Frispy app.

## Architecture Pattern

The app follows a **Component-Based Architecture** with **Custom Hooks** for business logic separation.

### Key Principles

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Reusability**: Components and hooks are designed to be reused
3. **Performance**: Memoization and optimization techniques throughout
4. **Maintainability**: Clean code structure and consistent patterns
5. **Scalability**: Easy to add new features and screens

## Folder Structure Explained

### `/src/components/common/`
Reusable UI components used across the app.

**StatCard.js**
- Displays statistics with icon, value, and optional trend
- Used in Dashboard and Sales screens
- Memoized for performance

**AlertBanner.js**
- Shows contextual alerts (info, warning, error, success)
- Used for low stock notifications
- Configurable actions

**LoadingSpinner.js**
- Centered loading indicator
- Used during data fetching

**EmptyState.js**
- Displays when no data is available
- Configurable icon, title, message, and action

**MenuItem.js**
- Menu item card for POS screen
- Shows price, category, and quantity badge

**InventoryItem.js**
- List item for inventory with quantity controls
- Visual stock indicators and progress bar

### `/src/hooks/`
Custom React hooks for business logic.

**useInventory.js**
- Manages inventory CRUD operations
- Provides getLowStockItems, getItemsByCategory
- Returns loading and error states

**useSales.js**
- Manages sales data and analytics
- Computes daily/weekly/monthly metrics
- Uses memoization for computed values

**useMenu.js**
- Manages menu items
- Provides category filtering and search

### `/src/context/`
Global state management.

**AppContext.js**
- Initializes app with sample data
- Provides global refresh functionality
- Can be extended for theme, auth, etc.

### `/src/data/`
Data layer and storage.

**store.js**
- AsyncStorage operations
- Sample data definitions
- CRUD operations for all entities

### `/src/utils/`
Utility functions.

**analytics.js**
- Sales analytics calculations
- Date/time formatting
- Low stock detection

### `/src/theme/`
Theming and styling.

**theme.js**
- Dark theme configuration
- Color palette
- Spacing and typography scales

### `/src/navigation/`
Navigation configuration.

**AppNavigator.js**
- Bottom tab navigation
- Screen configuration
- Theme integration

### `/src/screens/`
Main app screens.

Each screen follows this pattern:
1. Import hooks and components
2. Fetch data with custom hooks
3. Compute derived state with useMemo
4. Define callbacks with useCallback
5. Render UI with reusable components

## Design Patterns

### 1. Custom Hooks Pattern

Instead of mixing business logic with UI, we extract it into custom hooks:

```javascript
// ❌ Bad: Logic in component
const Component = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('key').then(setData);
  }, []);

  return <View>{/* UI */}</View>;
};

// ✅ Good: Logic in custom hook
const Component = () => {
  const { data, loading } = useCustomHook();

  return <View>{/* UI */}</View>;
};
```

### 2. Memoization Pattern

We use `useMemo` and `useCallback` to optimize performance:

```javascript
// Memoize expensive calculations
const filteredData = useMemo(() => {
  return data.filter(item => item.active);
}, [data]);

// Memoize callbacks to prevent re-renders
const handlePress = useCallback(() => {
  doSomething();
}, []);
```

### 3. Component Composition

Build complex UIs from simple, reusable components:

```javascript
<Screen>
  <StatCard {...props} />
  <AlertBanner {...props} />
  <List>
    {items.map(item => <ListItem key={item.id} {...item} />)}
  </List>
</Screen>
```

### 4. Render Props & Children

Components accept children or render functions for flexibility:

```javascript
<EmptyState
  title="No Data"
  actionLabel="Add Item"
  onAction={handleAdd}
/>
```

## Performance Optimizations

### 1. React.memo
All reusable components are wrapped with `React.memo`:

```javascript
export default React.memo(Component);
```

### 2. useMemo for Computed Values
Analytics and filtered data use `useMemo`:

```javascript
const dailySales = useMemo(() =>
  getDailySales(sales),
[sales]);
```

### 3. useCallback for Event Handlers
Callbacks use `useCallback` to prevent re-renders:

```javascript
const handleUpdate = useCallback(async (id, value) => {
  await updateItem(id, value);
}, [updateItem]);
```

### 4. FlatList Optimization
Lists use `keyExtractor` and proper item components:

```javascript
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ItemComponent item={item} />}
/>
```

## State Management

### Local State (useState)
Used for UI-specific state:
- Search queries
- Modal visibility
- Selected filters

### Custom Hooks
Used for data fetching and business logic:
- useSales, useInventory, useMenu
- Encapsulate AsyncStorage operations

### Context
Used for global app state:
- App initialization
- Theme (can be extended)
- Auth (can be added)

## Data Flow

```
User Action
    ↓
Component Event Handler (useCallback)
    ↓
Custom Hook Method
    ↓
Data Store (AsyncStorage)
    ↓
Hook Updates State
    ↓
Component Re-renders (optimized with memo)
```

## Adding New Features

### Adding a New Screen

1. Create screen file in `/src/screens/`
2. Use custom hooks for data
3. Use reusable components for UI
4. Add screen to navigator
5. Update navigation types

### Adding a New Component

1. Create component in `/src/components/common/`
2. Accept props with TypeScript (can be added)
3. Use theme for styling
4. Wrap with React.memo
5. Export from index.js

### Adding a New Hook

1. Create hook file in `/src/hooks/`
2. Use useState for internal state
3. Use useCallback for methods
4. Use useMemo for computed values
5. Return clean API
6. Export from index.js

## Code Style Guidelines

### 1. File Naming
- Components: PascalCase (StatCard.js)
- Hooks: camelCase with 'use' prefix (useSales.js)
- Utilities: camelCase (analytics.js)

### 2. Component Structure
```javascript
// 1. Imports
import React, { useState, useCallback } from 'react';

// 2. Component definition
const Component = ({ prop1, prop2 }) => {
  // 3. Hooks
  const { data } = useCustomHook();

  // 4. Local state
  const [state, setState] = useState();

  // 5. Computed values
  const computed = useMemo(() => {}, []);

  // 6. Callbacks
  const handleAction = useCallback(() => {}, []);

  // 7. Effects
  useEffect(() => {}, []);

  // 8. Render
  return <View />;
};

// 9. Styles
const styles = StyleSheet.create({});

// 10. Export
export default React.memo(Component);
```

### 3. Import Order
1. React and React Native
2. Third-party libraries
3. Custom hooks
4. Components
5. Utils and constants
6. Styles and theme

## Testing Strategy (Can be implemented)

### Unit Tests
- Test custom hooks in isolation
- Test utility functions
- Test data transformations

### Component Tests
- Test component rendering
- Test user interactions
- Test prop changes

### Integration Tests
- Test screen flows
- Test navigation
- Test data persistence

## Future Improvements

### Type Safety
Add TypeScript:
- Type all components
- Type all hooks
- Type all utilities

### Code Splitting
Lazy load screens:
```javascript
const DashboardScreen = lazy(() => import('./screens/DashboardScreen'));
```

### Error Boundaries
Add error handling:
```javascript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Backend Integration
Replace AsyncStorage with API calls:
- Create API service layer
- Add authentication
- Implement real-time sync

## Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://reactnativepaper.com/)
- [React Hooks](https://react.dev/reference/react)

---

Last updated: 2025-10-16
