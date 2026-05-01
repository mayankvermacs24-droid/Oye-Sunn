import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Colors from '../theme/colors';
import { Typography, Spacing, BorderRadius } from '../theme/typography';

/**
 * Chip - Rounded oval data chip for attributes
 * Matches the time/day chips in the reference exactly
 */
export function Chip({
  label,
  selected = false,
  onPress,
  size = 'medium', // 'small' | 'medium' | 'large'
  style,
  disabled = false,
}) {
  const sizeStyles = {
    small: { paddingHorizontal: 12, paddingVertical: 6 },
    medium: { paddingHorizontal: 16, paddingVertical: 8 },
    large: { paddingHorizontal: 20, paddingVertical: 10 },
  };

  const s = sizeStyles[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.chip,
        s,
        {
          backgroundColor: selected ? Colors.backgroundDark : Colors.chipBg,
          borderColor: selected ? Colors.backgroundDark : Colors.chipBgAlt,
        },
        style,
      ]}
    >
      <Text
        style={[
          Typography.chip,
          { color: selected ? Colors.textLight : Colors.chipText },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * ChipGroup - A group of selectable chips
 */
export function ChipGroup({
  items, // Array of { label, value }
  selected, // string or array for multi-select
  onSelect,
  multiSelect = false,
  style,
}) {
  const isSelected = (value) => {
    if (multiSelect && Array.isArray(selected)) {
      return selected.includes(value);
    }
    return selected === value;
  };

  const handleSelect = (value) => {
    if (multiSelect && Array.isArray(selected)) {
      if (selected.includes(value)) {
        onSelect(selected.filter((v) => v !== value));
      } else {
        onSelect([...selected, value]);
      }
    } else {
      onSelect(value);
    }
  };

  return (
    <View style={[styles.chipGroup, style]}>
      {items.map((item) => (
        <Chip
          key={item.value}
          label={item.label}
          selected={isSelected(item.value)}
          onPress={() => handleSelect(item.value)}
          style={{ marginRight: Spacing.sm, marginBottom: Spacing.sm }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: BorderRadius.pill,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});
