import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ORDERS_STORAGE_KEY = '@frispy_orders';

/**
 * Custom hook for managing orders
 */
export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load orders from storage
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const ordersJson = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
      if (ordersJson) {
        const parsedOrders = JSON.parse(ordersJson);
        setOrders(parsedOrders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save orders to storage
  const saveOrders = useCallback(async (ordersData) => {
    try {
      await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(ordersData));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  }, []);

  // Add new order
  const addOrder = useCallback(async (orderData) => {
    try {
      const newOrder = {
        id: Date.now().toString(),
        orderNumber: `#${Date.now().toString().slice(-6)}`,
        items: orderData.items,
        total: orderData.total,
        status: orderData.status || 'completed', // Default to completed when checkout is done
        timestamp: new Date().toISOString(),
      };

      const updatedOrders = [newOrder, ...orders];
      await saveOrders(updatedOrders);
      return newOrder;
    } catch (error) {
      console.error('Error adding order:', error);
      return null;
    }
  }, [orders, saveOrders]);

  // Update order status
  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      await saveOrders(updatedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  }, [orders, saveOrders]);

  // Delete order
  const deleteOrder = useCallback(async (orderId) => {
    try {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      await saveOrders(updatedOrders);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  }, [orders, saveOrders]);

  // Get orders by status
  const getOrdersByStatus = useCallback((status) => {
    return orders.filter(order => order.status === status);
  }, [orders]);

  // Get today's orders
  const getTodaysOrders = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return orders.filter(order => {
      const orderDate = new Date(order.timestamp);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });
  }, [orders]);

  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return {
    orders,
    loading,
    loadOrders,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    getOrdersByStatus,
    getTodaysOrders,
  };
};
