import { useState, useEffect, useCallback, useMemo } from 'react';
import { DataStore } from '../data/store';
import {
  getDailySales,
  getWeeklySales,
  getMonthlySales,
  getBestSellers,
  getSalesByDay,
  getPeakHours,
} from '../utils/analytics';

/**
 * Custom hook for managing sales data and analytics
 * Provides sales operations and computed analytics
 */
export const useSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load sales data
  const loadSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DataStore.getSales();
      setSales(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading sales:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new sale
  const addSale = useCallback(async (saleData) => {
    try {
      const newSale = await DataStore.addSale(saleData);
      if (newSale) {
        setSales(prev => [...prev, newSale]);
        return newSale;
      }
      return null;
    } catch (err) {
      setError(err.message);
      console.error('Error adding sale:', err);
      return null;
    }
  }, []);

  // Computed analytics - memoized for performance
  const dailySales = useMemo(() => getDailySales(sales), [sales]);
  const weeklySales = useMemo(() => getWeeklySales(sales), [sales]);
  const monthlySales = useMemo(() => getMonthlySales(sales), [sales]);
  const bestSellers = useMemo(() => getBestSellers(sales), [sales]);
  const dailyBestSellers = useMemo(() => getBestSellers(dailySales.sales), [dailySales]);
  const weeklyChart = useMemo(() => getSalesByDay(sales, 7), [sales]);
  const monthlyChart = useMemo(() => getSalesByDay(sales, 30), [sales]);
  const peakHours = useMemo(() => getPeakHours(sales), [sales]);

  // Get sales for specific date range
  const getSalesInRange = useCallback((startDate, endDate) => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.timestamp);
      return saleDate >= startDate && saleDate <= endDate;
    });
  }, [sales]);

  // Initial load
  useEffect(() => {
    loadSales();
  }, [loadSales]);

  return {
    sales,
    loading,
    error,
    loadSales,
    addSale,
    // Analytics
    dailySales,
    weeklySales,
    monthlySales,
    bestSellers,
    dailyBestSellers,
    weeklyChart,
    monthlyChart,
    peakHours,
    getSalesInRange,
  };
};
