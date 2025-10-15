import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, ScrollView, FlatList, useWindowDimensions } from 'react-native';
import {
  Text,
  Button,
  Chip,
  Divider,
  IconButton,
  Portal,
  Modal,
  useTheme,
  Card,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useMenu, useSales, useOrders } from '../hooks';
import { MenuItem, LoadingSpinner, EmptyState } from '../components/common';
import { formatCurrency, formatCurrencyCompact } from '../utils/analytics';
import { spacing } from '../theme/theme';

/**
 * POS (Point of Sale) Screen
 * Allows creating orders and processing sales
 */
const POSScreen = ({ navigation }) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { menuItems, categories, loading } = useMenu();
  const { addSale } = useSales();
  const { addOrder } = useOrders();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);

  // Calculate number of columns based on screen width
  const numColumns = useMemo(() => {
    if (width >= 1200) return 5; // Desktop large
    if (width >= 900) return 4;  // Desktop/Tablet landscape
    if (width >= 600) return 3;  // Tablet portrait
    return 2; // Mobile
  }, [width]);

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return menuItems;
    return menuItems.filter(item => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  // Calculate cart totals
  const cartItems = useMemo(() => {
    return Object.entries(cart).map(([itemId, quantity]) => {
      const item = menuItems.find(i => i.id === itemId);
      return {
        ...item,
        quantity,
        total: item.price * quantity,
      };
    });
  }, [cart, menuItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.total, 0);
  }, [cartItems]);

  const cartItemCount = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  // Add item to cart
  const addToCart = useCallback((item) => {
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((item) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[item.id] > 1) {
        newCart[item.id]--;
      } else {
        delete newCart[item.id];
      }
      return newCart;
    });
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCart({});
  }, []);

  // Process sale
  const processSale = useCallback(async () => {
    if (cartItems.length === 0) return;

    const orderData = {
      items: cartItems,
      total: cartTotal,
      status: 'completed', // Mark as completed since checkout is done
    };

    // Add to orders (will show up in Orders tab immediately)
    const order = await addOrder(orderData);

    // Also add to sales for analytics
    const sale = await addSale(orderData);

    if (order && sale) {
      clearCart();
      setShowCheckout(false);

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Order Completed! 🎉',
        text2: `${order.orderNumber} • ${formatCurrency(cartTotal)}`,
        visibilityTime: 3000,
        position: 'top',
      });

      // Navigate to Orders tab after a short delay
      setTimeout(() => {
        navigation.navigate('Orders');
      }, 500);
    }
  }, [cartItems, cartTotal, addOrder, addSale, clearCart, navigation]);

  if (loading) {
    return <LoadingSpinner message="Loading menu..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="cash-register" size={28} color={theme.colors.primary} />
          <View style={styles.headerText}>
            <Text variant="titleLarge" style={styles.headerTitle}>
              Point of Sale
            </Text>
            <Text variant="bodySmall" style={styles.headerSubtitle}>
              Select items to create order
            </Text>
          </View>
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.filterSection}>
        <Text variant="titleSmall" style={styles.filterTitle}>
          Categories
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          <Chip
            selected={selectedCategory === 'All'}
            onPress={() => setSelectedCategory('All')}
            style={styles.categoryChip}
            showSelectedCheck={false}
            icon="format-list-bulleted"
          >
            All Items
          </Chip>
          {categories.map((category) => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={styles.categoryChip}
              showSelectedCheck={false}
              icon={
                category === 'Chicken' ? 'food-drumstick' :
                category === 'Burgers' ? 'hamburger' :
                category === 'Sides' ? 'french-fries' :
                category === 'Beverages' ? 'cup' :
                'food'
              }
            >
              {category}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Menu Items Grid */}
      <ScrollView style={styles.menuScroll} contentContainerStyle={styles.menuGrid}>
        {filteredItems.length > 0 ? (
          <View style={styles.menuGridContainer}>
            {filteredItems.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.menuItemWrapper,
                  {
                    width: width >= 1200 ? '18%' : // 5 columns
                           width >= 900 ? '23%' :  // 4 columns
                           width >= 600 ? '31%' :  // 3 columns
                           '48%' // 2 columns
                  }
                ]}
              >
                <MenuItem
                  item={item}
                  quantity={cart[item.id] || 0}
                  showQuantity={true}
                  onPress={addToCart}
                  onDecrease={removeFromCart}
                />
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            icon="food-off"
            title="No Items"
            message="No menu items available in this category"
          />
        )}
      </ScrollView>

      {/* Cart Summary Bar */}
      {cartItemCount > 0 && (
        <Card style={[styles.cartBar, { backgroundColor: theme.colors.surface }]} mode="elevated" elevation={4}>
          <Card.Content style={styles.cartContent}>
            <View style={[styles.cartSummary, width < 400 && styles.cartSummaryMobile]}>
              <View style={[styles.cartInfo, width < 400 && styles.cartInfoMobile]}>
                <MaterialCommunityIcons name="cart" size={width < 400 ? 20 : 24} color={theme.colors.primary} />
                <View style={styles.cartDetails}>
                  <Text variant="bodySmall" style={styles.cartLabel}>
                    {width < 400 ? 'Total' : 'Total Amount'}
                  </Text>
                  <Text variant={width < 400 ? "titleMedium" : "headlineSmall"} style={[styles.cartTotal, { color: theme.colors.primary }]}>
                    {width < 400 ? formatCurrencyCompact(cartTotal) : formatCurrency(cartTotal)}
                  </Text>
                </View>
              </View>
              <View style={[styles.cartActions, width < 400 && styles.cartActionsMobile]}>
                <IconButton
                  icon="delete-outline"
                  size={width < 400 ? 20 : 24}
                  onPress={clearCart}
                  iconColor={theme.colors.error}
                  style={styles.deleteButton}
                />
                <Button
                  mode="contained"
                  onPress={() => setShowCheckout(true)}
                  style={styles.checkoutButton}
                  icon="cash-register"
                  compact={width < 400}
                  labelStyle={width < 400 && styles.checkoutButtonLabelSmall}
                >
                  {width < 400 ? `Checkout (${cartItemCount})` : `Checkout (${cartItemCount})`}
                </Button>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Checkout Modal */}
      <Portal>
        <Modal
          visible={showCheckout}
          onDismiss={() => setShowCheckout(false)}
          contentContainerStyle={[
            styles.checkoutModal,
            { backgroundColor: theme.colors.surface }
          ]}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <MaterialCommunityIcons name="receipt-text" size={28} color={theme.colors.primary} />
            <Text variant="headlineSmall" style={styles.modalTitle}>
              Order Summary
            </Text>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setShowCheckout(false)}
              iconColor={theme.colors.onSurface}
            />
          </View>

          <Divider style={styles.modalDivider} />

          {/* Order Items */}
          <ScrollView style={styles.checkoutItems}>
            {cartItems.map((item) => (
              <Card key={item.id} style={styles.checkoutItemCard} mode="outlined">
                <Card.Content style={styles.checkoutItemContent}>
                  <View style={styles.checkoutItemInfo}>
                    <Text style={styles.checkoutItemEmoji}>{item.image}</Text>
                    <View style={styles.checkoutItemDetails}>
                      <Text variant="titleMedium" style={styles.checkoutItemName}>
                        {item.name}
                      </Text>
                      <Text variant="bodySmall" style={styles.checkoutItemPrice}>
                        {formatCurrency(item.price)} each
                      </Text>
                    </View>
                  </View>

                  <View style={styles.checkoutItemRight}>
                    <View style={styles.checkoutItemControls}>
                      <IconButton
                        icon="minus-circle"
                        size={24}
                        onPress={() => removeFromCart(item)}
                        iconColor={theme.colors.error}
                      />
                      <Text variant="titleMedium" style={styles.checkoutItemQty}>
                        {item.quantity}
                      </Text>
                      <IconButton
                        icon="plus-circle"
                        size={24}
                        onPress={() => addToCart(item)}
                        iconColor={theme.colors.primary}
                      />
                    </View>
                    <Text variant="titleLarge" style={[styles.checkoutItemTotal, { color: theme.colors.primary }]}>
                      {formatCurrency(item.total)}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>

          <Divider style={styles.modalDivider} />

          {/* Total Section */}
          <View style={[styles.checkoutTotalContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
            <View style={styles.checkoutTotal}>
              <Text variant="headlineSmall" style={styles.totalLabel}>Total Amount</Text>
              <Text variant="headlineLarge" style={[styles.checkoutTotalAmount, { color: theme.colors.primary }]}>
                {formatCurrency(cartTotal)}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.checkoutButtons}>
            <Button
              mode="outlined"
              onPress={() => setShowCheckout(false)}
              style={styles.cancelButton}
              icon="close-circle-outline"
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={processSale}
              style={styles.completeButton}
              icon="check-circle"
            >
              Complete Sale
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
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
  filterSection: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  filterTitle: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    fontWeight: '600',
    opacity: 0.7,
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryChip: {
    marginRight: spacing.xs,
  },
  menuScroll: {
    flex: 1,
  },
  menuGrid: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  menuGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: spacing.sm,
  },
  menuItemWrapper: {
    marginBottom: spacing.sm,
  },
  cartBar: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 16,
  },
  cartContent: {
    paddingVertical: spacing.sm,
  },
  cartSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartSummaryMobile: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cartInfoMobile: {
    gap: spacing.sm,
  },
  cartDetails: {
    gap: spacing.xs / 2,
  },
  cartLabel: {
    opacity: 0.7,
  },
  cartTotal: {
    fontWeight: 'bold',
  },
  cartActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  cartActionsMobile: {
    width: '100%',
    justifyContent: 'space-between',
  },
  deleteButton: {
    margin: 0,
  },
  checkoutButton: {
    minWidth: 140,
  },
  checkoutButtonLabelSmall: {
    fontSize: 13,
  },
  checkoutModal: {
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  modalTitle: {
    fontWeight: 'bold',
    flex: 1,
  },
  modalDivider: {
    marginVertical: spacing.md,
  },
  checkoutItems: {
    maxHeight: 350,
  },
  checkoutItemCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
  },
  checkoutItemContent: {
    paddingVertical: spacing.md,
  },
  checkoutItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  checkoutItemEmoji: {
    fontSize: 40,
  },
  checkoutItemDetails: {
    flex: 1,
  },
  checkoutItemName: {
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
  },
  checkoutItemPrice: {
    opacity: 0.7,
  },
  checkoutItemRight: {
    gap: spacing.sm,
  },
  checkoutItemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  checkoutItemQty: {
    minWidth: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  checkoutItemTotal: {
    fontWeight: 'bold',
    textAlign: 'right',
  },
  checkoutTotalContainer: {
    marginHorizontal: -spacing.lg,
    marginBottom: -spacing.lg,
    padding: spacing.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  checkoutTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontWeight: '600',
  },
  checkoutTotalAmount: {
    fontWeight: 'bold',
  },
  checkoutButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
  },
  completeButton: {
    flex: 1,
  },
});

export default POSScreen;
