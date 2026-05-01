import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../theme/typography';

/**
 * ActionButton - Large rounded-rectangle action button
 * Matches the orange CTA button style from the reference
 */
export function ActionButton({
  title,
  onPress,
  icon,
  iconRight = true,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'outline'
  size = 'large', // 'large' | 'medium' | 'small'
  disabled = false,
  loading = false,
  style,
}) {
  const variantStyles = {
    primary: {
      bg: Colors.accentOrange,
      text: Colors.textOnOrange,
      activeBg: Colors.accentOrangeDark,
    },
    secondary: {
      bg: Colors.backgroundDark,
      text: Colors.textLight,
      activeBg: Colors.greenDark,
    },
    danger: {
      bg: Colors.danger,
      text: Colors.white,
      activeBg: '#A83A3A',
    },
    outline: {
      bg: 'transparent',
      text: Colors.textDark,
      activeBg: Colors.chipBg,
      border: Colors.textMuted,
    },
  };

  const sizeStyles = {
    large: { height: 56, paddingHorizontal: 28, borderRadius: BorderRadius.xl },
    medium: { height: 48, paddingHorizontal: 22, borderRadius: BorderRadius.lg },
    small: { height: 40, paddingHorizontal: 16, borderRadius: BorderRadius.md },
  };

  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? Colors.toggleInactive : v.bg,
          height: s.height,
          paddingHorizontal: s.paddingHorizontal,
          borderRadius: s.borderRadius,
        },
        v.border && { borderWidth: 1.5, borderColor: v.border },
        variant === 'primary' && !disabled && Shadows.medium,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && !iconRight && (
            <Ionicons
              name={icon}
              size={size === 'small' ? 18 : 20}
              color={disabled ? Colors.textMuted : v.text}
              style={{ marginRight: Spacing.sm }}
            />
          )}
          <Text
            style={[
              size === 'small' ? Typography.buttonSmall : Typography.button,
              { color: disabled ? Colors.textMuted : v.text },
            ]}
          >
            {title}
          </Text>
          {icon && iconRight && (
            <Ionicons
              name={icon}
              size={size === 'small' ? 18 : 20}
              color={disabled ? Colors.textMuted : v.text}
              style={{ marginLeft: Spacing.sm }}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

/**
 * PillButton - Pill-shaped action button for bottom actions
 * Matches the bottom pill button in the reference
 */
export function PillButton({
  title,
  onPress,
  icon,
  variant = 'dark', // 'dark' | 'light' | 'orange'
  style,
  disabled = false,
}) {
  const variantStyles = {
    dark: { bg: Colors.backgroundDark, text: Colors.textLight },
    light: { bg: Colors.chipBg, text: Colors.textDark },
    orange: { bg: Colors.accentOrange, text: Colors.textOnOrange },
  };

  const v = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.pill,
        { backgroundColor: disabled ? Colors.toggleInactive : v.bg },
        Shadows.soft,
        style,
      ]}
    >
      <Text style={[Typography.buttonSmall, { color: disabled ? Colors.textMuted : v.text }]}>
        {title}
      </Text>
      {icon && (
        <Ionicons
          name={icon}
          size={18}
          color={disabled ? Colors.textMuted : v.text}
          style={{ marginLeft: Spacing.sm }}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: BorderRadius.pill,
  },
});
