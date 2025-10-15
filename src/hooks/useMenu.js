import { useState, useEffect, useCallback, useMemo } from 'react';
import { DataStore } from '../data/store';

/**
 * Custom hook for managing menu items
 * Provides menu operations and category filtering
 */
export const useMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load menu items
  const loadMenu = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DataStore.getMenuItems();
      setMenuItems(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading menu:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(menuItems.map(item => item.category))];
    return uniqueCategories.sort();
  }, [menuItems]);

  // Get items by category
  const getItemsByCategory = useCallback((category) => {
    return menuItems.filter(item => item.category === category);
  }, [menuItems]);

  // Search items
  const searchItems = useCallback((query) => {
    const lowercaseQuery = query.toLowerCase();
    return menuItems.filter(item =>
      item.name.toLowerCase().includes(lowercaseQuery)
    );
  }, [menuItems]);

  // Add menu item
  const addMenuItem = useCallback(async (item) => {
    try {
      const newItem = {
        ...item,
        id: Date.now().toString(),
      };
      const updatedMenu = [...menuItems, newItem];
      await DataStore.saveMenuItems(updatedMenu);
      setMenuItems(updatedMenu);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error adding menu item:', err);
      return false;
    }
  }, [menuItems]);

  // Update menu item
  const updateMenuItem = useCallback(async (itemId, updates) => {
    try {
      const updatedMenu = menuItems.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      );
      await DataStore.saveMenuItems(updatedMenu);
      setMenuItems(updatedMenu);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error updating menu item:', err);
      return false;
    }
  }, [menuItems]);

  // Delete menu item
  const deleteMenuItem = useCallback(async (itemId) => {
    try {
      const updatedMenu = menuItems.filter(item => item.id !== itemId);
      await DataStore.saveMenuItems(updatedMenu);
      setMenuItems(updatedMenu);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting menu item:', err);
      return false;
    }
  }, [menuItems]);

  // Initial load
  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  return {
    menuItems,
    categories,
    loading,
    error,
    loadMenu,
    getItemsByCategory,
    searchItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  };
};
