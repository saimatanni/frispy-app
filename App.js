import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { AppProvider } from './src/context';
import { darkTheme } from './src/theme/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { sampleMenuItems } from './src/data/store';

/**
 * Frispy - Fast Food Inventory & POS App
 * Main App Component
 */
export default function App() {
  useEffect(() => {
    // Force update menu items on app start
    const updateMenu = async () => {
      try {
        await AsyncStorage.setItem('@frispy_menu_items', JSON.stringify(sampleMenuItems));
        console.log('Menu updated with latest items');
      } catch (error) {
        console.error('Error updating menu:', error);
      }
    };
    updateMenu();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={darkTheme}>
        <AppProvider>
          <StatusBar style="light" />
          <AppNavigator />
          <Toast />
        </AppProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
