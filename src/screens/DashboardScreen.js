import React, { useCallback, useState, useMemo } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, useWindowDimensions, TouchableOpacity, Modal } from 'react-native';
import { Text, Card, Chip, Avatar, Surface, useTheme, Button, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { useSales, useInventory } from '../hooks';
import { LoadingSpinner } from '../components/common';
import { formatCurrency } from '../utils/analytics';
import { spacing } from '../theme/theme';

/**
 * Enhanced Dashboard Screen - Modern Beautiful Design
 * Professional fast food inventory management interface
 */
const DashboardScreen = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { dailySales, weeklySales, monthlySales, dailyBestSellers, loading: salesLoading, loadSales, getSalesInRange } = useSales();
  const { getLowStockItems, loading: inventoryLoading, loadInventory, inventory } = useInventory();

  const [refreshing, setRefreshing] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [markedDates, setMarkedDates] = useState({});

  const lowStockItems = getLowStockItems();
  const loading = salesLoading || inventoryLoading;

  // Calculate card width based on screen size
  const cardWidth = useMemo(() => {
    if (width >= 1200) return '23%'; // 4 columns on large desktop
    if (width >= 900) return '31%';  // 3 columns on desktop/tablet landscape
    if (width >= 600) return '48%';  // 2 columns on tablet portrait
    return '48%'; // 2 columns on mobile
  }, [width]);

  // Get sales for selected date range
  const getFilteredSales = useCallback(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59);
      return getSalesInRange(start, end);
    }
    return [];
  }, [dateRange, getSalesInRange]);

  const filteredSales = getFilteredSales();
  const customRangeTotal = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const customRangeCount = filteredSales.length;

  // Format date range display
  const getDateRangeText = () => {
    if (!dateRange.startDate || !dateRange.endDate) return 'Select Date Range';
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  // Handle date selection
  const onDayPress = (day) => {
    if (!dateRange.startDate || (dateRange.startDate && dateRange.endDate)) {
      // Start new range
      setDateRange({ startDate: day.dateString, endDate: null });
      setMarkedDates({
        [day.dateString]: { startingDay: true, color: theme.colors.primary, textColor: 'white' },
      });
    } else {
      // Complete range
      const start = new Date(dateRange.startDate);
      const end = new Date(day.dateString);

      if (end < start) {
        // If end is before start, swap them
        setDateRange({ startDate: day.dateString, endDate: dateRange.startDate });
        markPeriod(day.dateString, dateRange.startDate);
      } else {
        setDateRange({ ...dateRange, endDate: day.dateString });
        markPeriod(dateRange.startDate, day.dateString);
      }
    }
  };

  const markPeriod = (start, end) => {
    const marked = {};
    const startDate = new Date(start);
    const endDate = new Date(end);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      if (dateString === start) {
        marked[dateString] = { startingDay: true, color: theme.colors.primary, textColor: 'white' };
      } else if (dateString === end) {
        marked[dateString] = { endingDay: true, color: theme.colors.primary, textColor: 'white' };
      } else {
        marked[dateString] = { color: theme.colors.primary + '40', textColor: theme.colors.text };
      }
    }
    setMarkedDates(marked);
  };

  const clearDateRange = () => {
    setDateRange({ startDate: null, endDate: null });
    setMarkedDates({});
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadSales(), loadInventory()]);
    setRefreshing(false);
  }, [loadSales, loadInventory]);

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tint={theme.colors.primary}
        />
      }
    >
      {/* Professional Header */}
      <LinearGradient
        colors={['#FF6B35', '#FFA500']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <View style={styles.logoContainer}>
                <MaterialCommunityIcons name="food" size={32} color="#FFF" />
              </View>
              <View>
                <Text variant="headlineSmall" style={styles.headerTitle}>
                  Frispy Dashboard
                </Text>
                <Text variant="bodyMedium" style={styles.headerSubtitle}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <MaterialCommunityIcons name="bell-outline" size={24} color="#FFF" />
              {lowStockItems.length > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>{lowStockItems.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Date Range Filter */}
          <TouchableOpacity
            style={styles.dateRangeButton}
            onPress={() => setShowCalendar(true)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="calendar-range" size={18} color="#FFF" />
            <Text variant="bodyMedium" style={styles.dateRangeText}>
              {getDateRangeText()}
            </Text>
            {dateRange.startDate && dateRange.endDate && (
              <IconButton
                icon="close"
                size={16}
                iconColor="#FFF"
                onPress={(e) => {
                  e.stopPropagation();
                  clearDateRange();
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.calendarModal, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text variant="titleLarge" style={styles.modalTitle}>
                Select Date Range
              </Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setShowCalendar(false)}
              />
            </View>

            <Calendar
              markingType="period"
              markedDates={markedDates}
              onDayPress={onDayPress}
              theme={{
                backgroundColor: theme.colors.surface,
                calendarBackground: theme.colors.surface,
                textSectionTitleColor: theme.colors.text,
                selectedDayBackgroundColor: theme.colors.primary,
                selectedDayTextColor: '#ffffff',
                todayTextColor: theme.colors.primary,
                dayTextColor: theme.colors.text,
                textDisabledColor: theme.colors.disabled,
                monthTextColor: theme.colors.text,
                arrowColor: theme.colors.primary,
              }}
            />

            <View style={styles.modalFooter}>
              <Button mode="outlined" onPress={clearDateRange}>
                Clear
              </Button>
              <Button
                mode="contained"
                onPress={() => setShowCalendar(false)}
                disabled={!dateRange.startDate || !dateRange.endDate}
              >
                Apply
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Alert Banner - Minimal */}
      {lowStockItems.length > 0 && (
        <View style={styles.alertCard}>
          <View style={styles.alertDot} />
          <View style={styles.alertTextContainer}>
            <Text variant="bodyMedium" style={styles.alertText}>
              {lowStockItems.length} items running low on stock
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.error} />
        </View>
      )}

      {/* Clean Stats Grid */}
      <View style={styles.statsContainer}>
        {/* Big Revenue Card */}
        <Card style={styles.revenueCard} mode="contained">
          <Card.Content style={styles.revenueContent}>
            <Text variant="bodySmall" style={styles.revenueLabel}>
              {dateRange.startDate && dateRange.endDate ? 'Custom Range Revenue' : "Today's Revenue"}
            </Text>
            <Text variant="displayLarge" style={styles.revenueValue}>
              {formatCurrency(dateRange.startDate && dateRange.endDate ? customRangeTotal : dailySales.total)}
            </Text>
            <Text variant="bodyMedium" style={styles.revenueSubtext}>
              {dateRange.startDate && dateRange.endDate ? customRangeCount : dailySales.count} orders • ${((dateRange.startDate && dateRange.endDate ? customRangeTotal / customRangeCount : dailySales.total / dailySales.count) || 0).toFixed(2)} avg
            </Text>
          </Card.Content>
        </Card>

        {/* 3 Column Stats */}
        <View style={styles.miniStatsRow}>
          <View style={styles.miniStat}>
            <Text variant="headlineMedium" style={styles.miniStatNumber}>
              {weeklySales.count}
            </Text>
            <Text variant="bodySmall" style={styles.miniStatText}>
              Weekly Orders
            </Text>
          </View>
          <View style={[styles.miniStat, styles.miniStatBorder]}>
            <Text variant="headlineMedium" style={styles.miniStatNumber}>
              {monthlySales.count}
            </Text>
            <Text variant="bodySmall" style={styles.miniStatText}>
              Monthly Orders
            </Text>
          </View>
          <View style={styles.miniStat}>
            <Text variant="headlineMedium" style={styles.miniStatNumber}>
              {formatCurrency(monthlySales.total)}
            </Text>
            <Text variant="bodySmall" style={styles.miniStatText}>
              Month Revenue
            </Text>
          </View>
        </View>
      </View>

      {/* Today's Sales Summary */}
      <View style={styles.todaySection}>
        <Text variant="titleLarge" style={styles.sectionTitleClean}>
          Today's Sales
        </Text>

        <View style={styles.todayGrid}>
          <Card style={[styles.todayCard, { width: cardWidth }]} mode="outlined">
            <Card.Content style={styles.todayCardContent}>
              <MaterialCommunityIcons name="cash-multiple" size={28} color="#4CAF50" />
              <Text variant="headlineSmall" style={[styles.todayValue, { color: '#4CAF50' }]}>
                {formatCurrency(dailySales.total)}
              </Text>
              <Text variant="bodySmall" style={styles.todayLabel}>
                Revenue
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.todayCard, { width: cardWidth }]} mode="outlined">
            <Card.Content style={styles.todayCardContent}>
              <MaterialCommunityIcons name="receipt-text" size={28} color="#FF6B35" />
              <Text variant="headlineSmall" style={[styles.todayValue, { color: '#FF6B35' }]}>
                {dailySales.count}
              </Text>
              <Text variant="bodySmall" style={styles.todayLabel}>
                Orders
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.todayCard, { width: cardWidth }]} mode="outlined">
            <Card.Content style={styles.todayCardContent}>
              <MaterialCommunityIcons name="chart-line" size={28} color="#4ECDC4" />
              <Text variant="headlineSmall" style={[styles.todayValue, { color: '#4ECDC4' }]}>
                {formatCurrency(dailySales.count > 0 ? dailySales.total / dailySales.count : 0)}
              </Text>
              <Text variant="bodySmall" style={styles.todayLabel}>
                Avg Order
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.todayCard, { width: cardWidth }]} mode="outlined">
            <Card.Content style={styles.todayCardContent}>
              <MaterialCommunityIcons name="food" size={28} color="#FFD23F" />
              <Text variant="headlineSmall" style={[styles.todayValue, { color: '#FFD23F' }]}>
                {dailyBestSellers.reduce((sum, item) => sum + item.quantity, 0)}
              </Text>
              <Text variant="bodySmall" style={styles.todayLabel}>
                Items Sold
              </Text>
            </Card.Content>
          </Card>
        </View>
      </View>

      {/* Best Sellers - Compact List */}
      <View style={styles.bestSellersSection}>
        <Text variant="titleLarge" style={styles.sectionTitleClean}>
          Top Selling Items
        </Text>

        {dailyBestSellers.length > 0 ? (
          <View style={styles.productList}>
            {dailyBestSellers.slice(0, 5).map((item, index) => (
              <Card key={item.id} style={styles.productListCard} mode="outlined">
                <Card.Content style={styles.productListContent}>
                  <View style={styles.productListLeft}>
                    <View style={[styles.rankBadge, index < 3 && styles.rankBadgeTop]}>
                      {index < 3 ? (
                        <MaterialCommunityIcons name="trophy" size={16} color="#FF6B35" />
                      ) : (
                        <Text style={styles.rankNumber}>#{index + 1}</Text>
                      )}
                    </View>
                    <View style={styles.productEmojiContainer}>
                      <Text style={styles.productEmojiSmall}>{item.image}</Text>
                    </View>
                    <View style={styles.productInfo}>
                      <Text variant="titleSmall" style={styles.productNameSmall} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text variant="bodySmall" style={styles.productQuantitySmall}>
                        {item.quantity} sold
                      </Text>
                    </View>
                  </View>
                  <Text variant="titleMedium" style={styles.productRevenueSmall}>
                    {formatCurrency(item.revenue)}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        ) : (
          <Text variant="bodyMedium" style={styles.emptyStateText}>
            No sales yet today
          </Text>
        )}
      </View>

      {/* Inventory - Clean Cards */}
      {lowStockItems.length > 0 && (
        <View style={styles.inventorySection}>
          <Text variant="titleLarge" style={styles.sectionTitleClean}>
            Low Stock Alert
          </Text>
          {lowStockItems.slice(0, 3).map((item) => (
            <View key={item.id} style={styles.lowStockRow}>
              <View>
                <Text variant="bodyLarge" style={styles.lowStockName}>
                  {item.name}
                </Text>
                <Text variant="bodySmall" style={styles.lowStockQty}>
                  {item.quantity} {item.unit} remaining
                </Text>
              </View>
              <Text variant="bodySmall" style={styles.lowStockBadge}>
                Low
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerContent: {
    paddingHorizontal: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: spacing.xs / 2,
  },
  headerSubtitle: {
    color: '#FFF',
    opacity: 0.9,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#CF6679',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs / 2,
  },
  notificationBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dateRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
  },
  dateRangeText: {
    marginLeft: spacing.sm,
    flex: 1,
    color: '#FFF',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  calendarModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  modalTitle: {
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  alertCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: 'rgba(207, 102, 121, 0.1)',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#CF6679',
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CF6679',
    marginRight: spacing.md,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertText: {
    color: '#CF6679',
  },
  statsContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  revenueCard: {
    marginBottom: spacing.lg,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  revenueContent: {
    paddingVertical: spacing.xl,
  },
  revenueLabel: {
    opacity: 0.6,
    marginBottom: spacing.sm,
  },
  revenueValue: {
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: spacing.sm,
  },
  revenueSubtext: {
    opacity: 0.6,
  },
  miniStatsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: spacing.md,
  },
  miniStat: {
    flex: 1,
    alignItems: 'center',
  },
  miniStatBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  miniStatNumber: {
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  miniStatText: {
    opacity: 0.6,
    textAlign: 'center',
  },
  todaySection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  todayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  todayCard: {
    borderRadius: 12,
  },
  todayCardContent: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  todayValue: {
    fontWeight: 'bold',
  },
  todayLabel: {
    opacity: 0.7,
    textAlign: 'center',
  },
  bestSellersSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitleClean: {
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  productList: {
    gap: spacing.sm,
  },
  productListCard: {
    borderRadius: 12,
    marginBottom: spacing.xs,
  },
  productListContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  productListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadgeTop: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
  },
  rankNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    opacity: 0.6,
  },
  productEmojiContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productEmojiSmall: {
    fontSize: 24,
  },
  productInfo: {
    flex: 1,
  },
  productNameSmall: {
    fontWeight: '600',
    marginBottom: 2,
  },
  productQuantitySmall: {
    opacity: 0.6,
    fontSize: 12,
  },
  productRevenueSmall: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  emptyStateText: {
    opacity: 0.5,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  inventorySection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  lowStockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(207, 102, 121, 0.05)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#CF6679',
  },
  lowStockName: {
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
  },
  lowStockQty: {
    opacity: 0.6,
  },
  lowStockBadge: {
    color: '#CF6679',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});

export default DashboardScreen;
