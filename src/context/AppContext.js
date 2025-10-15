import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { DataStore } from '../data/store';

/**
 * Global App Context
 * Manages global state including menu, inventory, and sales data
 */
const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Initialize app with sample data
  const initializeApp = useCallback(async () => {
    try {
      const hasData = await DataStore.getSales();
      if (!hasData || hasData.length === 0) {
        await DataStore.initializeSampleData();
      }
      setInitialized(true);
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }, []);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    try {
      // Trigger a refresh event that components can listen to
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  const value = {
    initialized,
    refreshing,
    refreshAll,
    initializeApp,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
