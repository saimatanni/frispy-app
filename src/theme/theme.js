import { MD3DarkTheme, configureFonts } from 'react-native-paper';

// Configure fonts for all platforms
const fontConfig = {
  web: {
    regular: {
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '100',
    },
  },
  ios: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
  android: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  },
};

// Frispy Dark Theme - Modern and Attractive
const configuredFonts = configureFonts({ config: fontConfig, isV3: true });

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FF6B35', // Vibrant Orange - Fast food energy
    secondary: '#FFD23F', // Golden Yellow - Accent
    tertiary: '#4ECDC4', // Teal - Fresh look
    background: '#121212', // Deep dark background
    surface: '#1E1E1E', // Card background
    surfaceVariant: '#2A2A2A', // Slightly lighter surface
    error: '#CF6679', // Error red
    success: '#4CAF50', // Success green
    warning: '#FFA726', // Warning orange
    onBackground: '#FFFFFF', // Text on background
    onSurface: '#FFFFFF', // Text on surface
    outline: '#3A3A3A', // Border color
    text: '#FFFFFF',
    disabled: '#666666',
    placeholder: '#999999',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  fonts: {
    ...configuredFonts,
    // Add bold property for React Navigation compatibility
    bold: configuredFonts.bodyLarge,
  },
  roundness: 12, // Rounded corners
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};
