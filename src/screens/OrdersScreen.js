import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Text, Card, Chip, useTheme, IconButton, Divider, DataTable } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOrders } from '../hooks';
import { LoadingSpinner, EmptyState } from '../components/common';
import { formatCurrency, formatTime } from '../utils/analytics';
import { spacing } from '../theme/theme';

/**
 * Orders Screen
 * Displays all orders in a table format
 */
const OrdersScreen = () => {
  const theme = useTheme();
  const { orders, loading, loadOrders, updateOrderStatus, deleteOrder } = useOrders();
  const [refreshing, setRefreshing] = useState(false);

  // Reload orders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  }, [loadOrders]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return theme.colors.warning;
      case 'preparing':
        return '#4ECDC4';
      case 'completed':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.onSurface;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'clock-outline';
      case 'preparing':
        return 'chef-hat';
      case 'completed':
        return 'check-circle';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading orders..." />;
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="clipboard-list" size={28} color={theme.colors.primary} />
          <View style={styles.headerText}>
            <Text variant="titleLarge" style={styles.headerTitle}>
              Orders
            </Text>
            <Text variant="bodySmall" style={styles.headerSubtitle}>
              Manage all orders
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard} mode="outlined">
          <Card.Content style={styles.statContent}>
            <Text variant="headlineSmall" style={[styles.statValue, { color: theme.colors.primary }]}>
              {orders.length}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Total Orders
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard} mode="outlined">
          <Card.Content style={styles.statContent}>
            <Text variant="headlineSmall" style={[styles.statValue, { color: theme.colors.warning }]}>
              {orders.filter(o => o.status === 'pending').length}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Pending
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard} mode="outlined">
          <Card.Content style={styles.statContent}>
            <Text variant="headlineSmall" style={[styles.statValue, { color: theme.colors.success }]}>
              {orders.filter(o => o.status === 'completed').length}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Completed
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Orders List */}
      <View style={styles.ordersSection}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          All Orders
        </Text>

        {orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order.id} style={styles.orderCard} mode="elevated" elevation={1}>
              <Card.Content style={styles.orderContent}>
                {/* Order Header */}
                <View style={styles.orderHeader}>
                  <View style={styles.orderHeaderLeft}>
                    <Text variant="titleMedium" style={styles.orderNumber}>
                      {order.orderNumber}
                    </Text>
                    <Chip
                      icon={getStatusIcon(order.status)}
                      style={[styles.statusChip, { backgroundColor: `${getStatusColor(order.status)}20` }]}
                      textStyle={[styles.statusText, { color: getStatusColor(order.status) }]}
                      compact
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Chip>
                  </View>
                  <Text variant="bodySmall" style={styles.orderTime}>
                    {formatTime(order.timestamp)}
                  </Text>
                </View>

                <Divider style={styles.divider} />

                {/* Order Items */}
                <View style={styles.itemsList}>
                  {order.items.map((item, index) => (
                    <View key={index} style={styles.orderItem}>
                      <Text style={styles.itemEmoji}>{item.image}</Text>
                      <Text variant="bodyMedium" style={styles.itemName}>
                        {item.name}
                      </Text>
                      <Text variant="bodyMedium" style={styles.itemQuantity}>
                        x{item.quantity}
                      </Text>
                      <Text variant="bodyMedium" style={styles.itemPrice}>
                        {formatCurrency(item.total)}
                      </Text>
                    </View>
                  ))}
                </View>

                <Divider style={styles.divider} />

                {/* Order Footer */}
                <View style={styles.orderFooter}>
                  <View style={styles.totalContainer}>
                    <Text variant="titleMedium" style={styles.totalLabel}>
                      Total
                    </Text>
                    <Text variant="titleLarge" style={[styles.totalValue, { color: theme.colors.primary }]}>
                      {formatCurrency(order.total)}
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    {order.status === 'pending' && (
                      <IconButton
                        icon="chef-hat"
                        size={20}
                        onPress={() => updateOrderStatus(order.id, 'preparing')}
                        iconColor="#4ECDC4"
                        style={styles.actionButton}
                      />
                    )}
                    {order.status === 'preparing' && (
                      <IconButton
                        icon="check-circle"
                        size={20}
                        onPress={() => updateOrderStatus(order.id, 'completed')}
                        iconColor={theme.colors.success}
                        style={styles.actionButton}
                      />
                    )}
                    {(order.status === 'pending' || order.status === 'preparing') && (
                      <IconButton
                        icon="close-circle"
                        size={20}
                        onPress={() => updateOrderStatus(order.id, 'cancelled')}
                        iconColor={theme.colors.error}
                        style={styles.actionButton}
                      />
                    )}
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => deleteOrder(order.id)}
                      iconColor={theme.colors.error}
                      style={styles.actionButton}
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))
        ) : (
          <EmptyState
            icon="clipboard-list-outline"
            title="No Orders"
            message="No orders have been placed yet"
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.xs / 2,
  },
  headerSubtitle: {
    opacity: 0.6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statValue: {
    fontWeight: 'bold',
    marginBottom: spacing.xs / 2,
  },
  statLabel: {
    opacity: 0.7,
    textAlign: 'center',
  },
  ordersSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  orderCard: {
    marginBottom: spacing.md,
    borderRadius: 16,
  },
  orderContent: {
    paddingVertical: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  orderNumber: {
    fontWeight: 'bold',
  },
  statusChip: {
    height: 28,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderTime: {
    opacity: 0.6,
  },
  divider: {
    marginVertical: spacing.md,
  },
  itemsList: {
    gap: spacing.sm,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  itemEmoji: {
    fontSize: 20,
  },
  itemName: {
    flex: 1,
  },
  itemQuantity: {
    opacity: 0.7,
    minWidth: 30,
  },
  itemPrice: {
    fontWeight: '600',
    minWidth: 60,
    textAlign: 'right',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  totalLabel: {
    opacity: 0.7,
  },
  totalValue: {
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    margin: 0,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});

export default OrdersScreen;
