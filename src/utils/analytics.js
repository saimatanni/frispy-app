// Analytics utility functions for sales data

export const getDateRange = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
};

export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

export const isThisWeek = (date) => {
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const checkDate = new Date(date);
  return checkDate >= weekAgo && checkDate <= today;
};

export const isThisMonth = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

// Get daily sales total
export const getDailySales = (sales) => {
  const todaySales = sales.filter(sale => isToday(sale.timestamp));
  const total = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const count = todaySales.length;
  return { total, count, sales: todaySales };
};

// Get weekly sales total
export const getWeeklySales = (sales) => {
  const weekSales = sales.filter(sale => isThisWeek(sale.timestamp));
  const total = weekSales.reduce((sum, sale) => sum + sale.total, 0);
  const count = weekSales.length;
  return { total, count, sales: weekSales };
};

// Get monthly sales total
export const getMonthlySales = (sales) => {
  const monthSales = sales.filter(sale => isThisMonth(sale.timestamp));
  const total = monthSales.reduce((sum, sale) => sum + sale.total, 0);
  const count = monthSales.length;
  return { total, count, sales: monthSales };
};

// Get best selling items
export const getBestSellers = (sales, limit = 5) => {
  const itemCounts = {};

  sales.forEach(sale => {
    sale.items.forEach(item => {
      if (itemCounts[item.id]) {
        itemCounts[item.id].quantity += item.quantity;
        itemCounts[item.id].revenue += item.total;
      } else {
        itemCounts[item.id] = {
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          revenue: item.total,
          image: item.image,
        };
      }
    });
  });

  return Object.values(itemCounts)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
};

// Get sales by day for the last N days
export const getSalesByDay = (sales, days = 7) => {
  const salesByDay = {};
  const today = new Date();

  // Initialize all days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    salesByDay[dateKey] = { date: dateKey, total: 0, count: 0 };
  }

  // Aggregate sales
  sales.forEach(sale => {
    const saleDate = new Date(sale.timestamp);
    const dateKey = saleDate.toISOString().split('T')[0];
    if (salesByDay[dateKey]) {
      salesByDay[dateKey].total += sale.total;
      salesByDay[dateKey].count += 1;
    }
  });

  return Object.values(salesByDay);
};

// Get peak hours (sales by hour)
export const getPeakHours = (sales) => {
  const hourCounts = {};

  for (let i = 0; i < 24; i++) {
    hourCounts[i] = { hour: i, count: 0, total: 0 };
  }

  sales.forEach(sale => {
    const hour = new Date(sale.timestamp).getHours();
    hourCounts[hour].count += 1;
    hourCounts[hour].total += sale.total;
  });

  return Object.values(hourCounts).sort((a, b) => b.count - a.count);
};

// Get low stock items
export const getLowStockItems = (inventory) => {
  return inventory.filter(item => item.quantity <= item.minQuantity);
};

// Format currency
export const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`;
};

// Format large numbers with abbreviations (k, M, B)
export const formatNumber = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

// Format currency with abbreviations for large amounts
export const formatCurrencyCompact = (amount) => {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)}B`;
  }
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 10000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return `$${amount.toFixed(2)}`;
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format time
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
