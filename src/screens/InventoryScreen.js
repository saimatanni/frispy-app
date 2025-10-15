import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList, ScrollView } from 'react-native';
import { Searchbar, Chip, useTheme, FAB, Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useInventory } from '../hooks';
import { InventoryItem, LoadingSpinner, EmptyState } from '../components/common';
import { spacing } from '../theme/theme';

/**
 * Inventory Management Screen
 * Displays and manages inventory items with stock control
 */
const InventoryScreen = () => {
  const theme = useTheme();
  const {
    inventory,
    loading,
    updateQuantity,
    getLowStockItems,
  } = useInventory();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All' | 'Low Stock' | 'In Stock'

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(inventory.map(item => item.category))].sort();
  }, [inventory]);

  // Filter and search inventory
  const filteredInventory = useMemo(() => {
    let filtered = inventory;

    // Filter by stock status
    if (filterType === 'Low Stock') {
      filtered = getLowStockItems();
    } else if (filterType === 'In Stock') {
      filtered = inventory.filter(item => item.quantity > item.minQuantity);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.supplier.toLowerCase().includes(query)
      );
    }

    // Sort by stock percentage (ascending)
    return filtered.sort((a, b) => {
      const aPercent = a.quantity / a.minQuantity;
      const bPercent = b.quantity / b.minQuantity;
      return aPercent - bPercent;
    });
  }, [inventory, searchQuery, filterType, getLowStockItems]);

  // Handle increment
  const handleIncrement = useCallback(async (item) => {
    await updateQuantity(item.id, item.quantity + 1);
  }, [updateQuantity]);

  // Handle decrement
  const handleDecrement = useCallback(async (item) => {
    if (item.quantity > 0) {
      await updateQuantity(item.id, item.quantity - 1);
    }
  }, [updateQuantity]);

  // Calculate inventory stats
  const inventoryStats = useMemo(() => {
    const totalItems = inventory.length;
    const lowStockCount = getLowStockItems().length;
    const inStockCount = inventory.filter(item => item.quantity > item.minQuantity).length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * (item.price || 0)), 0);

    return {
      totalItems,
      lowStockCount,
      inStockCount,
      totalValue,
    };
  }, [inventory, getLowStockItems]);

  if (loading) {
    return <LoadingSpinner message="Loading inventory..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Stats Summary */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsScroll}
        contentContainerStyle={styles.statsContainer}
      >
        <Card style={styles.statCard} mode="elevated" elevation={2}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons name="package-variant" size={32} color={theme.colors.primary} />
            <View style={styles.statInfo}>
              <Text variant="headlineMedium" style={[styles.statValue, { color: theme.colors.primary }]}>
                {inventoryStats.totalItems}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Total Items
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statCard} mode="elevated" elevation={2}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons name="alert-circle" size={32} color={theme.colors.warning} />
            <View style={styles.statInfo}>
              <Text variant="headlineMedium" style={[styles.statValue, { color: theme.colors.warning }]}>
                {inventoryStats.lowStockCount}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Low Stock
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statCard} mode="elevated" elevation={2}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons name="check-circle" size={32} color={theme.colors.success} />
            <View style={styles.statInfo}>
              <Text variant="headlineMedium" style={[styles.statValue, { color: theme.colors.success }]}>
                {inventoryStats.inStockCount}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                In Stock
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search inventory..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        icon="magnify"
      />

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        <Chip
          selected={filterType === 'All'}
          onPress={() => setFilterType('All')}
          style={styles.filterChip}
          showSelectedCheck={false}
          icon="format-list-bulleted"
        >
          All ({inventory.length})
        </Chip>
        <Chip
          selected={filterType === 'Low Stock'}
          onPress={() => setFilterType('Low Stock')}
          style={styles.filterChip}
          showSelectedCheck={false}
          icon="alert"
          textStyle={filterType === 'Low Stock' ? { color: theme.colors.warning } : {}}
        >
          Low Stock ({getLowStockItems().length})
        </Chip>
        <Chip
          selected={filterType === 'In Stock'}
          onPress={() => setFilterType('In Stock')}
          style={styles.filterChip}
          showSelectedCheck={false}
          icon="check-circle"
        >
          In Stock
        </Chip>
      </ScrollView>

      {/* Inventory List */}
      <FlatList
        data={filteredInventory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="package-variant-closed"
            title="No Items Found"
            message={
              searchQuery
                ? "No items match your search"
                : "No inventory items in this category"
            }
          />
        }
        renderItem={({ item }) => (
          <InventoryItem
            item={item}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
        )}
      />

      {/* Add New Item FAB */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          // Handle add new item
          alert('Add new item feature - Coming soon!');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsScroll: {
    maxHeight: 120,
  },
  statsContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  statCard: {
    minWidth: 160,
    borderRadius: 16,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  statInfo: {
    gap: spacing.xs / 2,
  },
  statValue: {
    fontWeight: 'bold',
  },
  statLabel: {
    opacity: 0.7,
  },
  searchBar: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    borderRadius: 12,
  },
  filterScroll: {
    maxHeight: 50,
  },
  filterContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    marginRight: spacing.xs,
  },
  list: {
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
  },
});

export default InventoryScreen;
