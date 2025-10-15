import React, { useState, useMemo } from 'react';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { Text, SegmentedButtons, Divider, useTheme, List, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useSales } from '../hooks';
import { StatCard, LoadingSpinner, EmptyState } from '../components/common';
import { formatCurrency, formatDate, formatTime } from '../utils/analytics';
import { spacing } from '../theme/theme';

const { width } = Dimensions.get('window');

/**
 * Sales Analytics Screen
 * Displays sales data, charts, and best sellers
 */
const SalesScreen = () => {
  const theme = useTheme();
  const {
    dailySales,
    weeklySales,
    monthlySales,
    bestSellers,
    weeklyChart,
    monthlyChart,
    loading,
  } = useSales();

  const [timeRange, setTimeRange] = useState('daily'); // 'daily' | 'weekly' | 'monthly'

  // Get current data based on selected time range
  const currentData = useMemo(() => {
    switch (timeRange) {
      case 'daily':
        return dailySales;
      case 'weekly':
        return weeklySales;
      case 'monthly':
        return monthlySales;
      default:
        return dailySales;
    }
  }, [timeRange, dailySales, weeklySales, monthlySales]);

  const chartData = useMemo(() => {
    return timeRange === 'monthly' ? monthlyChart : weeklyChart;
  }, [timeRange, weeklyChart, monthlyChart]);

  if (loading) {
    return <LoadingSpinner message="Loading sales data..." />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Time Range Selector */}
      <View style={styles.segmentContainer}>
        <SegmentedButtons
          value={timeRange}
          onValueChange={setTimeRange}
          buttons={[
            { value: 'daily', label: 'Today' },
            { value: 'weekly', label: 'Week' },
            { value: 'monthly', label: 'Month' },
          ]}
        />
      </View>

      {/* Sales Overview */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Sales Overview
        </Text>

        <View style={styles.statsRow}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(currentData.total)}
            subtitle={`${currentData.count} orders`}
            icon="cash-multiple"
            iconColor={theme.colors.success}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Orders"
            value={currentData.count.toString()}
            subtitle="Total transactions"
            icon="receipt"
            iconColor={theme.colors.primary}
          />
          <StatCard
            title="Avg Order"
            value={formatCurrency(currentData.count > 0 ? currentData.total / currentData.count : 0)}
            subtitle="Per transaction"
            icon="chart-line"
            iconColor={theme.colors.tertiary}
          />
        </View>
      </View>

      <Divider style={styles.divider} />

      {/* Sales Trend Chart */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Sales Trend
        </Text>

        <Card style={styles.chartCard} mode="elevated" elevation={2}>
          <Card.Content>
            {chartData.length > 0 ? (
              <LineChart
                data={{
                  labels: chartData.slice(-7).map((day) =>
                    new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
                  ),
                  datasets: [
                    {
                      data: chartData.slice(-7).map((day) => day.total || 0),
                    },
                  ],
                }}
                width={width - spacing.md * 4}
                height={220}
                chartConfig={{
                  backgroundColor: theme.colors.surface,
                  backgroundGradientFrom: theme.colors.surface,
                  backgroundGradientTo: theme.colors.surfaceVariant,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: theme.colors.primary,
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                bezier
                style={styles.chart}
              />
            ) : (
              <View style={styles.emptyChart}>
                <MaterialCommunityIcons name="chart-line" size={48} color={theme.colors.disabled} />
                <Text variant="bodyMedium" style={styles.emptyChartText}>
                  No data available
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </View>

      <Divider style={styles.divider} />

      {/* Best Sellers */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Best Sellers
        </Text>

        {bestSellers.length > 0 ? (
          bestSellers.slice(0, 5).map((item, index) => (
            <Card key={item.id} style={styles.bestSellerCard} mode="elevated" elevation={1}>
              <Card.Content style={styles.bestSellerContent}>
                <View style={styles.bestSellerLeft}>
                  <View style={[styles.rankBadge, { backgroundColor: index < 3 ? `${theme.colors.primary}30` : `${theme.colors.surfaceVariant}` }]}>
                    {index < 3 ? (
                      <MaterialCommunityIcons name="trophy" size={20} color={theme.colors.primary} />
                    ) : (
                      <Text variant="titleSmall" style={styles.rankText}>
                        #{index + 1}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.productEmoji}>{item.image}</Text>
                  <View style={styles.productInfo}>
                    <Text variant="titleMedium" style={styles.productName}>
                      {item.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.productSold}>
                      {item.quantity} sold
                    </Text>
                  </View>
                </View>
                <View style={styles.bestSellerRight}>
                  <Text variant="titleLarge" style={[styles.revenueText, { color: theme.colors.success }]}>
                    {formatCurrency(item.revenue)}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))
        ) : (
          <EmptyState
            icon="chart-box-outline"
            title="No Sales"
            message="No sales data available for this period"
          />
        )}
      </View>

      <Divider style={styles.divider} />

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Recent Transactions
        </Text>

        {currentData.sales.length > 0 ? (
          currentData.sales.slice(0, 8).map((sale) => (
            <Card key={sale.id} style={styles.transactionCard} mode="outlined">
              <Card.Content style={styles.transactionContent}>
                <View style={styles.transactionLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.tertiary}20` }]}>
                    <MaterialCommunityIcons name="receipt-text" size={24} color={theme.colors.tertiary} />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text variant="titleMedium" style={styles.transactionAmount}>
                      {formatCurrency(sale.total)}
                    </Text>
                    <Text variant="bodySmall" style={styles.transactionDetails}>
                      {sale.items.length} items • {formatTime(sale.timestamp)}
                    </Text>
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.onSurface} opacity={0.5} />
              </Card.Content>
            </Card>
          ))
        ) : (
          <EmptyState
            icon="receipt-text-outline"
            title="No Transactions"
            message="No transactions for this period"
          />
        )}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentContainer: {
    padding: spacing.md,
  },
  section: {
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xs,
  },
  divider: {
    marginVertical: spacing.md,
    marginHorizontal: spacing.md,
  },
  chartCard: {
    marginHorizontal: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
  },
  chart: {
    borderRadius: 16,
  },
  emptyChart: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyChartText: {
    opacity: 0.6,
  },
  bestSellerCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 16,
  },
  bestSellerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  bestSellerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  bestSellerRight: {
    alignItems: 'flex-end',
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontWeight: 'bold',
    opacity: 0.7,
  },
  productEmoji: {
    fontSize: 32,
  },
  productInfo: {
    flex: 1,
    gap: spacing.xs / 2,
  },
  productName: {
    fontWeight: '600',
  },
  productSold: {
    opacity: 0.7,
  },
  revenueText: {
    fontWeight: 'bold',
  },
  transactionCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 12,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    gap: spacing.xs / 2,
  },
  transactionAmount: {
    fontWeight: '600',
  },
  transactionDetails: {
    opacity: 0.7,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});

export default SalesScreen;
