import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing, fontSize } from '../../theme/theme';

/**
 * Reusable Stat Card Component
 * Displays a statistic with icon, title, value, and optional subtitle
 */
const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  trend,
  onPress
}) => {
  const theme = useTheme();

  const getTrendColor = () => {
    if (!trend) return theme.colors.text;
    return trend > 0 ? theme.colors.success : theme.colors.error;
  };

  return (
    <Card
      style={styles.card}
      mode="elevated"
      onPress={onPress}
    >
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={icon}
              size={28}
              color={iconColor || theme.colors.primary}
            />
          </View>
          {trend !== undefined && trend !== null && (
            <View style={styles.trendContainer}>
              <MaterialCommunityIcons
                name={trend >= 0 ? 'trending-up' : 'trending-down'}
                size={16}
                color={getTrendColor()}
              />
              <Text style={[styles.trendText, { color: getTrendColor() }]}>
                {Math.abs(trend)}%
              </Text>
            </View>
          )}
        </View>

        <Text variant="titleSmall" style={styles.title}>
          {title}
        </Text>

        <Text variant="headlineMedium" style={styles.value}>
          {value}
        </Text>

        {subtitle && (
          <Text variant="bodySmall" style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.sm,
    marginVertical: spacing.xs,
    flex: 1,
  },
  content: {
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  title: {
    opacity: 0.7,
    marginBottom: spacing.xs,
  },
  value: {
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  subtitle: {
    opacity: 0.6,
  },
});

export default React.memo(StatCard);
