import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import { Typography, Spacing, BorderRadius } from '../theme/typography';

/**
 * AppHeader - Simple header with back arrow and optional right icon
 * Matching the reference: clean header with back arrow and home icon
 */
export default function AppHeader({
  title,
  onBack,
  rightIcon,
  onRightPress,
  light = false, // true for light text on dark bg
  showBack = true,
}) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.container,
      { paddingTop: insets.top + Spacing.sm },
      light ? styles.containerDark : styles.containerLight,
    ]}>
      <View style={styles.row}>
        {/* Left: Back button */}
        <View style={styles.leftSection}>
          {showBack && onBack ? (
            <TouchableOpacity
              onPress={onBack}
              style={[
                styles.iconButton,
                light ? styles.iconButtonDark : styles.iconButtonLight,
              ]}
              activeOpacity={0.7}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={light ? Colors.textLight : Colors.textDark}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
        </View>

        {/* Center: Title */}
        <Text
          style={[
            styles.title,
            { color: light ? Colors.textLight : Colors.textDark },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {/* Right: Optional icon */}
        <View style={styles.rightSection}>
          {rightIcon ? (
            <TouchableOpacity
              onPress={onRightPress}
              style={[
                styles.iconButton,
                light ? styles.iconButtonDark : styles.iconButtonLight,
              ]}
              activeOpacity={0.7}
            >
              <Ionicons
                name={rightIcon}
                size={22}
                color={light ? Colors.textLight : Colors.textDark}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  containerDark: {
    backgroundColor: Colors.backgroundDark,
  },
  containerLight: {
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  leftSection: {
    width: 42,
    alignItems: 'flex-start',
  },
  rightSection: {
    width: 42,
    alignItems: 'flex-end',
  },
  title: {
    ...Typography.h3,
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonLight: {
    backgroundColor: Colors.chipBg,
  },
  iconButtonDark: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  iconPlaceholder: {
    width: 38,
    height: 38,
  },
});
