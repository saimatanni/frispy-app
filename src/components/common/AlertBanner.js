import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Banner, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '../../theme/theme';

/**
 * Reusable Alert Banner Component
 * Displays warnings, errors, info, or success messages
 */
const AlertBanner = ({
  visible,
  message,
  type = 'info', // 'info' | 'warning' | 'error' | 'success'
  icon,
  actions = [],
  onDismiss,
}) => {
  const theme = useTheme();

  const getTypeConfig = () => {
    switch (type) {
      case 'warning':
        return {
          icon: icon || 'alert',
          color: theme.colors.warning,
          backgroundColor: `${theme.colors.warning}20`,
        };
      case 'error':
        return {
          icon: icon || 'alert-circle',
          color: theme.colors.error,
          backgroundColor: `${theme.colors.error}20`,
        };
      case 'success':
        return {
          icon: icon || 'check-circle',
          color: theme.colors.success,
          backgroundColor: `${theme.colors.success}20`,
        };
      default:
        return {
          icon: icon || 'information',
          color: theme.colors.primary,
          backgroundColor: `${theme.colors.primary}20`,
        };
    }
  };

  const config = getTypeConfig();

  return (
    <Banner
      visible={visible}
      icon={({ size }) => (
        <MaterialCommunityIcons
          name={config.icon}
          size={size}
          color={config.color}
        />
      )}
      actions={actions}
      style={[styles.banner, { backgroundColor: config.backgroundColor }]}
      contentStyle={styles.content}
      onShowAnimationFinished={() => {}}
      onHideAnimationFinished={() => {}}
    >
      {message}
    </Banner>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: 8,
  },
  content: {
    paddingVertical: spacing.xs,
  },
});

export default React.memo(AlertBanner);
