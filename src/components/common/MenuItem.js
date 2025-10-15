import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme, Chip, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing, fontSize } from '../../theme/theme';

/**
 * Reusable Menu Item Component
 * Displays a menu item card with image, name, price, and quantity
 */
const MenuItem = ({
  item,
  quantity = 0,
  onPress,
  onDecrease,
  onLongPress,
  showQuantity = false,
}) => {
  const theme = useTheme();

  return (
    <Card
      style={styles.card}
      mode="elevated"
      elevation={2}
    >
      {/* Image Container with Gradient */}
      <View style={styles.imageContainer}>
        <LinearGradient
          colors={['#FF6B35', '#FFA500']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.imageGradient}
        >
          <Text style={styles.emoji}>{item.image}</Text>
        </LinearGradient>
        {showQuantity && quantity > 0 && (
          <View style={[styles.quantityBadge, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.quantityText}>{quantity}</Text>
          </View>
        )}
      </View>

      {/* Item Info */}
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.footer}>
          <Text variant="titleMedium" style={[styles.price, { color: theme.colors.primary }]}>
            ${item.price.toFixed(2)}
          </Text>
        </View>

        {/* Add/Remove Controls */}
        {showQuantity && (
          <View style={styles.controls}>
            <IconButton
              icon="minus-circle"
              size={28}
              onPress={() => onDecrease && onDecrease(item)}
              disabled={quantity === 0}
              iconColor={quantity === 0 ? theme.colors.disabled : theme.colors.error}
              style={styles.controlButton}
            />
            <IconButton
              icon="plus-circle"
              size={28}
              onPress={() => onPress && onPress(item)}
              iconColor={theme.colors.primary}
              style={styles.controlButton}
            />
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  imageGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 56,
  },
  quantityBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  quantityText: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  name: {
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  footer: {
    marginTop: spacing.xs / 2,
    marginBottom: spacing.xs,
  },
  price: {
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  controlButton: {
    margin: 0,
  },
});

export default React.memo(MenuItem);
