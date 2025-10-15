import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import { spacing } from '../../theme/theme';

/**
 * Reusable Loading Spinner Component
 * Displays a centered loading indicator with optional message
 */
const LoadingSpinner = ({ message = 'Loading...', size = 'large' }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={true}
        size={size}
        color={theme.colors.primary}
      />
      {message && (
        <Text variant="bodyMedium" style={styles.message}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  message: {
    marginTop: spacing.md,
    opacity: 0.7,
  },
});

export default React.memo(LoadingSpinner);
