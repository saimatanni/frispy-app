import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  MENU_ITEMS: '@frispy_menu_items',
  INVENTORY: '@frispy_inventory',
  SALES: '@frispy_sales',
  SUPPLIERS: '@frispy_suppliers',
};

// Sample Menu Items for Frispy (Based on actual menu)
export const sampleMenuItems = [
  // Snacks/Chicken
  { id: '1', name: 'FRISPY Chicken FRY', price: 90, category: 'Chicken', image: '🍗' },
  { id: '2', name: 'FRISPY French FRY', price: 70, category: 'Sides', image: '🍟' },
  { id: '3', name: 'FRISPY Meat BOX', price: 110, category: 'Chicken', image: '🍱' },
  { id: '4', name: 'Fried Chicken MOMO', price: 130, category: 'Chicken', image: '🥟' },
  { id: '5', name: 'Fried Chicken NAGA', price: 140, category: 'Chicken', image: '🥟' },
  { id: '6', name: 'Fried Chicken BBQ', price: 150, category: 'Chicken', image: '🥟' },
  { id: '7', name: 'Steamed Chicken MOMO', price: 130, category: 'Chicken', image: '🥟' },
  { id: '8', name: 'Steamed Chicken NAGA', price: 140, category: 'Chicken', image: '🥟' },
  { id: '9', name: 'Steamed Chicken BBQ', price: 150, category: 'Chicken', image: '🥟' },
  { id: '10', name: 'FRISPY Chipsy', price: 120, category: 'Sides', image: '🥔' },
  { id: '11', name: 'FRISPY Chicken Cutlet', price: 190, category: 'Chicken', image: '🍗' },
  { id: '12', name: 'FRISPY Grill Chicken PASTA', price: 150, category: 'Chicken', image: '🍝' },
  { id: '13', name: 'FRISPY WAFFLE', price: 150, category: 'Sides', image: '🧇' },
  { id: '14', name: 'FRISPY BUFFALO WINGS', price: 140, category: 'Chicken', image: '🍗' },
  { id: '15', name: 'BUFFALO WINGS NAGA', price: 140, category: 'Chicken', image: '🍗' },
  { id: '16', name: 'BUFFALO WINGS BBQ', price: 160, category: 'Chicken', image: '🍗' },

  // Drinks
  { id: '17', name: 'FRISPY COLD COFFEE', price: 100, category: 'Beverages', image: '☕' },
  { id: '18', name: 'FRISPY FIZZY LEMON', price: 100, category: 'Beverages', image: '🍋' },
  { id: '19', name: 'FRISPY BLUE OCEAN', price: 110, category: 'Beverages', image: '🥤' },
];

// Sample Inventory Items
export const sampleInventory = [
  { id: '1', name: 'Burger Buns', quantity: 150, minQuantity: 50, unit: 'pcs', category: 'Bakery', supplier: 'Local Bakery' },
  { id: '2', name: 'Beef Patties', quantity: 100, minQuantity: 30, unit: 'pcs', category: 'Meat', supplier: 'Meat Supplier Co' },
  { id: '3', name: 'Chicken Patties', quantity: 80, minQuantity: 30, unit: 'pcs', category: 'Meat', supplier: 'Meat Supplier Co' },
  { id: '4', name: 'Cheese Slices', quantity: 200, minQuantity: 50, unit: 'pcs', category: 'Dairy', supplier: 'Dairy Fresh' },
  { id: '5', name: 'Lettuce', quantity: 20, minQuantity: 10, unit: 'kg', category: 'Vegetables', supplier: 'Farm Fresh' },
  { id: '6', name: 'Tomatoes', quantity: 15, minQuantity: 10, unit: 'kg', category: 'Vegetables', supplier: 'Farm Fresh' },
  { id: '7', name: 'Onions', quantity: 12, minQuantity: 8, unit: 'kg', category: 'Vegetables', supplier: 'Farm Fresh' },
  { id: '8', name: 'Frozen Fries', quantity: 50, minQuantity: 20, unit: 'kg', category: 'Frozen', supplier: 'Frozen Foods Inc' },
  { id: '9', name: 'Coke Syrup', quantity: 8, minQuantity: 3, unit: 'boxes', category: 'Beverages', supplier: 'Beverage Distributor' },
  { id: '10', name: 'Sprite Syrup', quantity: 6, minQuantity: 3, unit: 'boxes', category: 'Beverages', supplier: 'Beverage Distributor' },
  { id: '11', name: 'Cups Small', quantity: 300, minQuantity: 100, unit: 'pcs', category: 'Packaging', supplier: 'Pack Pro' },
  { id: '12', name: 'Cups Large', quantity: 250, minQuantity: 100, unit: 'pcs', category: 'Packaging', supplier: 'Pack Pro' },
  { id: '13', name: 'Burger Boxes', quantity: 200, minQuantity: 75, unit: 'pcs', category: 'Packaging', supplier: 'Pack Pro' },
  { id: '14', name: 'Napkins', quantity: 500, minQuantity: 150, unit: 'pcs', category: 'Packaging', supplier: 'Pack Pro' },
];

// Data Store Functions
export const DataStore = {
  // Menu Items
  async getMenuItems() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
      return data ? JSON.parse(data) : sampleMenuItems;
    } catch (error) {
      console.error('Error loading menu items:', error);
      return sampleMenuItems;
    }
  },

  async saveMenuItems(items) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving menu items:', error);
    }
  },

  // Inventory
  async getInventory() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.INVENTORY);
      return data ? JSON.parse(data) : sampleInventory;
    } catch (error) {
      console.error('Error loading inventory:', error);
      return sampleInventory;
    }
  },

  async saveInventory(inventory) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  },

  async updateInventoryQuantity(itemId, newQuantity) {
    try {
      const inventory = await this.getInventory();
      const updatedInventory = inventory.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      await this.saveInventory(updatedInventory);
      return updatedInventory;
    } catch (error) {
      console.error('Error updating inventory:', error);
      return null;
    }
  },

  // Sales
  async getSales() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SALES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading sales:', error);
      return [];
    }
  },

  async saveSales(sales) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    } catch (error) {
      console.error('Error saving sales:', error);
    }
  },

  async addSale(sale) {
    try {
      const sales = await this.getSales();
      const newSale = {
        ...sale,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      sales.push(newSale);
      await this.saveSales(sales);
      return newSale;
    } catch (error) {
      console.error('Error adding sale:', error);
      return null;
    }
  },

  // Initialize with sample data
  async initializeSampleData() {
    try {
      await this.saveMenuItems(sampleMenuItems);
      await this.saveInventory(sampleInventory);

      // Add some sample sales data for the last 30 days
      const sales = [];
      const now = new Date();

      for (let i = 0; i < 90; i++) {
        const saleDate = new Date(now);
        saleDate.setDate(saleDate.getDate() - i);

        // Generate 10-30 random sales per day
        const numSales = Math.floor(Math.random() * 20) + 10;

        for (let j = 0; j < numSales; j++) {
          const randomItems = [];
          const numItems = Math.floor(Math.random() * 3) + 1;

          for (let k = 0; k < numItems; k++) {
            const randomItem = sampleMenuItems[Math.floor(Math.random() * sampleMenuItems.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            randomItems.push({
              ...randomItem,
              quantity,
              total: randomItem.price * quantity,
            });
          }

          const total = randomItems.reduce((sum, item) => sum + item.total, 0);

          sales.push({
            id: `sale_${i}_${j}`,
            items: randomItems,
            total: parseFloat(total.toFixed(2)),
            timestamp: new Date(saleDate.getTime() + j * 60000).toISOString(),
          });
        }
      }

      await this.saveSales(sales);
      return true;
    } catch (error) {
      console.error('Error initializing sample data:', error);
      return false;
    }
  },

  // Clear all data
  async clearAllData() {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  },
};
