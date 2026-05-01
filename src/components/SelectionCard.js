import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../theme/typography';

/**
 * SelectionCard - Rounded-rectangle card for selection grids
 * Matches the medicine type selection cards from the reference
 * Split-color backgrounds with large icons and soft shadows
 */
export function SelectionCard({
  label,
  icon,
  selected = false,
  onPress,
  style,
  size = 'medium', // 'small' | 'medium' 
}) {
  const isSmall = size === 'small';
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.card,
        isSmall ? styles.cardSmall : styles.cardMedium,
        selected ? styles.cardSelected : styles.cardDefault,
        Shadows.medium,
        style,
      ]}
    >
      {/* Split background effect */}
      <View style={[
        styles.iconArea,
        { backgroundColor: selected ? Colors.backgroundMedium : Colors.greenPale },
      ]}>
        <View style={[
          styles.iconCircle,
          { backgroundColor: selected ? 'rgba(255,255,255,0.15)' : 'rgba(45,59,45,0.08)' },
        ]}>
          <Ionicons
            name={icon}
            size={isSmall ? 28 : 36}
            color={selected ? Colors.textLight : Colors.backgroundDark}
          />
        </View>
      </View>
      
      <View style={[
        styles.labelArea,
        { backgroundColor: selected ? Colors.backgroundDark : Colors.backgroundCard },
      ]}>
        <Text
          style={[
            isSmall ? Typography.chip : Typography.h4,
            { color: selected ? Colors.textLight : Colors.textDark },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

/**
 * SelectionGrid - A grid of SelectionCards
 */
export function SelectionGrid({
  items, // Array of { label, icon, value }
  selected,
  onSelect,
  columns = 2,
  style,
}) {
  return (
    <View style={[styles.grid, style]}>
      {items.map((item) => (
        <SelectionCard
          key={item.value}
          label={item.label}
          icon={item.icon}
          selected={selected === item.value}
          onPress={() => onSelect(item.value)}
          style={{
            width: `${(100 / columns) - 3}%`,
            marginBottom: Spacing.md,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  cardMedium: {
    minHeight: 140,
  },
  cardSmall: {
    minHeight: 100,
  },
  cardDefault: {
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: Colors.accentOrange,
  },
  iconArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelArea: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
