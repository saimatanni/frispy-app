import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import POSScreen from '../screens/POSScreen';
import InventoryScreen from '../screens/InventoryScreen';
import SalesScreen from '../screens/SalesScreen';
import OrdersScreen from '../screens/OrdersScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const theme = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.outline,
          notification: theme.colors.primary,
        },
        fonts: theme.fonts,
      }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
            } else if (route.name === 'POS') {
              iconName = focused ? 'cash-register' : 'cash-register';
            } else if (route.name === 'Orders') {
              iconName = focused ? 'clipboard-list' : 'clipboard-list-outline';
            } else if (route.name === 'Inventory') {
              iconName = focused ? 'package-variant' : 'package-variant-closed';
            } else if (route.name === 'Sales') {
              iconName = focused ? 'chart-line' : 'chart-line';
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.disabled,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.outline,
          },
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Frispy Dashboard' }}
        />
        <Tab.Screen
          name="POS"
          component={POSScreen}
          options={{ title: 'Point of Sale' }}
        />
        <Tab.Screen
          name="Orders"
          component={OrdersScreen}
          options={{ title: 'Orders' }}
        />
        <Tab.Screen
          name="Inventory"
          component={InventoryScreen}
          options={{ title: 'Inventory' }}
        />
        <Tab.Screen
          name="Sales"
          component={SalesScreen}
          options={{ title: 'Sales Analytics' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
