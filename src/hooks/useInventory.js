import { useState, useEffect, useCallback } from 'react';
import { DataStore } from '../data/store';

/**
 * Custom hook for managing inventory data
 * Provides CRUD operations and real-time inventory status
 */
export const useInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load inventory data
  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DataStore.getInventory();
      setInventory(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading inventory:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update item quantity
  const updateQuantity = useCallback(async (itemId, newQuantity) => {
    try {
      const updatedInventory = await DataStore.updateInventoryQuantity(itemId, newQuantity);
      if (updatedInventory) {
        setInventory(updatedInventory);
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      console.error('Error updating quantity:', err);
      return false;
    }
  }, []);

  // Add new inventory item
  const addItem = useCallback(async (item) => {
    try {
      const newItem = {
        ...item,
        id: Date.now().toString(),
      };
      const updatedInventory = [...inventory, newItem];
      await DataStore.saveInventory(updatedInventory);
      setInventory(updatedInventory);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error adding item:', err);
      return false;
    }
  }, [inventory]);

  // Update existing item
  const updateItem = useCallback(async (itemId, updates) => {
    try {
      const updatedInventory = inventory.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      );
      await DataStore.saveInventory(updatedInventory);
      setInventory(updatedInventory);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error updating item:', err);
      return false;
    }
  }, [inventory]);

  // Delete item
  const deleteItem = useCallback(async (itemId) => {
    try {
      const updatedInventory = inventory.filter(item => item.id !== itemId);
      await DataStore.saveInventory(updatedInventory);
      setInventory(updatedInventory);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting item:', err);
      return false;
    }
  }, [inventory]);

  // Get low stock items
  const getLowStockItems = useCallback(() => {
    return inventory.filter(item => item.quantity <= item.minQuantity);
  }, [inventory]);

  // Get items by category
  const getItemsByCategory = useCallback((category) => {
    return inventory.filter(item => item.category === category);
  }, [inventory]);

  // Initial load
  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  return {
    inventory,
    loading,
    error,
    loadInventory,
    updateQuantity,
    addItem,
    updateItem,
    deleteItem,
    getLowStockItems,
    getItemsByCategory,
  };
};
