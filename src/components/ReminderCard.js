import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../theme/typography';
import { Chip } from './Chips';
import { PillButton } from './Buttons';

/**
 * ReminderCard - Flash card for displaying reminders
 * Detailed card with soft background, 3D-style icons, and oval chips
 */
export function ReminderCard({
  reminder,
  compact = false, // true for simplified home view
  onPress,
  onMarkDone,
  onEdit,
  expanded = false,
}) {
  const getProximityIcon = (proximity) => {
    switch (proximity) {
      case 'entering': return 'log-in-outline';
      case 'leaving': return 'log-out-outline';
      case 'both': return 'swap-horizontal-outline';
      default: return 'navigate-outline';
    }
  };

  const getProximityLabel = (proximity) => {
    switch (proximity) {
      case 'entering': return 'Entering';
      case 'leaving': return 'Leaving';
      case 'both': return 'Both';
      default: return proximity;
    }
  };

  const formatTimeRange = (startTime, endTime, allDay) => {
    if (allDay) return 'All Day';
    if (startTime && endTime) return `${startTime} - ${endTime}`;
    return 'No time set';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.card,
        reminder.isDone && styles.cardDone,
        Shadows.soft,
      ]}
    >
      {/* Top section: Icon + Name */}
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <View style={[
            styles.iconBg,
            { backgroundColor: reminder.isDone ? Colors.textMuted : Colors.backgroundMedium },
          ]}>
            <Ionicons
              name={reminder.isDone ? 'checkmark-circle' : 'location'}
              size={24}
              color={Colors.textLight}
            />
          </View>
        </View>
        <View style={styles.cardTitleArea}>
          <Text
            style={[
              Typography.h4,
              { color: Colors.textDark },
              reminder.isDone && { textDecorationLine: 'line-through', opacity: 0.6 },
            ]}
            numberOfLines={compact ? 1 : 2}
          >
            {reminder.name}
          </Text>
          {reminder.location && (
            <Text style={styles.locationText} numberOfLines={1}>
              📍 {reminder.location}
            </Text>
          )}
        </View>
        {/* Status indicator */}
        {!compact && (
          <View style={[
            styles.statusDot,
            { backgroundColor: reminder.isActive ? Colors.success : Colors.textMuted },
          ]} />
        )}
      </View>

      {/* Chips area: Proximity, Time */}
      <View style={styles.chipsRow}>
        <View style={styles.chipItem}>
          <Ionicons
            name={getProximityIcon(reminder.proximity)}
            size={14}
            color={Colors.chipText}
            style={{ marginRight: 4 }}
          />
          <Text style={[Typography.chip, { color: Colors.chipText }]}>
            {getProximityLabel(reminder.proximity)}
            {reminder.radius ? ` - ${reminder.radius}m` : ''}
          </Text>
        </View>

        <View style={styles.chipDivider} />

        <View style={styles.chipItem}>
          <Ionicons
            name="time-outline"
            size={14}
            color={Colors.chipText}
            style={{ marginRight: 4 }}
          />
          <Text style={[Typography.chip, { color: Colors.chipText }]}>
            {formatTimeRange(reminder.startTime, reminder.endTime, reminder.allDay)}
          </Text>
        </View>
      </View>

      {/* Active days chips */}
      {!compact && reminder.activeDays && reminder.activeDays.length > 0 && (
        <View style={styles.daysRow}>
          {reminder.activeDays.map((day) => (
            <View key={day} style={styles.dayChip}>
              <Text style={[Typography.caption, { color: Colors.chipText, fontSize: 11 }]}>
                {day}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Notes */}
      {!compact && reminder.notes && (
        <Text style={styles.notesText} numberOfLines={2}>
          {reminder.notes}
        </Text>
      )}

      {/* Expanded actions */}
      {expanded && !reminder.isDone && (
        <View style={styles.expandedActions}>
          <PillButton
            title="Edit Reminder"
            icon="create-outline"
            variant="light"
            onPress={onEdit}
            style={{ flex: 1, marginRight: Spacing.sm }}
          />
          <PillButton
            title="Mark as Done"
            icon="checkmark-circle-outline"
            variant="dark"
            onPress={onMarkDone}
            style={{ flex: 1 }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.backgroundDark,
  },
  cardDone: {
    borderLeftColor: Colors.textMuted,
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleArea: {
    flex: 1,
  },
  locationText: {
    ...Typography.small,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: Spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.chipBg,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  chipItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.chipBgAlt,
    marginHorizontal: Spacing.md,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.xs,
  },
  dayChip: {
    backgroundColor: Colors.chipBg,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Colors.chipBgAlt,
  },
  notesText: {
    ...Typography.small,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  expandedActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
});
