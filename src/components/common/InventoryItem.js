import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, IconButton, useTheme, ProgressBar, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing, fontSize } from '../../theme/theme';

/**
 * Reusable Inventory Item Component
 * Displays inventory item with quantity controls and stock status
 */
const InventoryItem = ({
  item,
  onIncrement,
  onDecrement,
  onPress,
}) => {
  const theme = useTheme();

  const stockPercentage = (item.quantity / (item.minQuantity * 3)) || 0;
  const isLowStock = item.quantity <= item.minQuantity;
  const isCritical = item.quantity <= item.minQuantity * 0.5;

  const getStockColor = () => {
    if (isCritical) return theme.colors.error;
    if (isLowStock) return theme.colors.warning;
    return theme.colors.success;
  };

  const getStockText = () => {
    if (isCritical) return 'Critical';
    if (isLowStock) return 'Low Stock';
    return 'In Stock';
  };

  const getStockIcon = () => {
    if (isCritical) return 'alert-circle';
    if (isLowStock) return 'alert';
    return 'check-circle';
  };

  return (
    <Card
      style={styles.card}
      mode="elevated"
      elevation={1}
      onPress={() => onPress && onPress(item)}
    >
      <Card.Content style={styles.content}>
        {/* Header Row */}
        <View style={styles.header}>
          <View style={styles.leftSection}>
            <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
              <MaterialCommunityIcons
                name="package-variant"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.itemInfo}>
              <Text variant="titleMedium" style={styles.name}>
                {item.name}
              </Text>
              <Text variant="bodySmall" style={styles.category}>
                {item.category} • {item.supplier}
              </Text>
            </View>
          </View>
          <Chip
            icon={getStockIcon()}
            style={[styles.statusChip, { backgroundColor: `${getStockColor()}20` }]}
            textStyle={[styles.statusText, { color: getStockColor() }]}
            compact
          >
            {getStockText()}
          </Chip>
        </View>

        {/* Stock Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text variant="bodySmall" style={styles.progressLabel}>
              Stock Level
            </Text>
            <Text variant="bodySmall" style={styles.minStock}>
              Min: {item.minQuantity} {item.unit}
            </Text>
          </View>
          <ProgressBar
            progress={Math.min(stockPercentage, 1)}
            color={getStockColor()}
            style={styles.progressBar}
          />
        </View>

        {/* Quantity Controls */}
        <View style={styles.quantitySection}>
          <View style={styles.quantityInfo}>
            <Text variant="bodySmall" style={styles.quantityLabel}>
              Current Stock
            </Text>
            <View style={styles.quantityDisplay}>
              <Text variant="headlineSmall" style={[styles.quantity, { color: theme.colors.primary }]}>
                {item.quantity}
              </Text>
              <Text variant="bodyMedium" style={styles.unit}>
                {item.unit}
              </Text>
            </View>
          </View>

          <View style={styles.controls}>
            <IconButton
              icon="minus-circle"
              size={28}
              onPress={() => onDecrement && onDecrement(item)}
              disabled={item.quantity <= 0}
              iconColor={item.quantity <= 0 ? theme.colors.disabled : theme.colors.error}
            />
            <IconButton
              icon="plus-circle"
              size={28}
              onPress={() => onIncrement && onIncrement(item)}
              iconColor={theme.colors.primary}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: 16,
  },
  content: {
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
  },
  category: {
    opacity: 0.7,
  },
  statusChip: {
    marginLeft: spacing.sm,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    opacity: 0.7,
    fontWeight: '500',
  },
  minStock: {
    opacity: 0.6,
    fontSize: fontSize.xs,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  quantityInfo: {
    gap: spacing.xs / 2,
  },
  quantityLabel: {
    opacity: 0.7,
    fontWeight: '500',
  },
  quantityDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  quantity: {
    fontWeight: 'bold',
  },
  unit: {
    opacity: 0.7,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});

export default React.memo(InventoryItem);
