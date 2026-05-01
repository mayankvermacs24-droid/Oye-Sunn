import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../theme/typography';
import AppHeader from '../components/AppHeader';
import { ReminderCard } from '../components/ReminderCard';
import { useApp } from '../context/AppContext';

export default function AllRemindersScreen({ navigation, route }) {
  const { reminders, markReminderDone, deleteReminder } = useApp();
  const insets = useSafeAreaInsets();
  const [expandedId, setExpandedId] = useState(route?.params?.expandId || null);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'done'

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const filteredReminders = reminders.filter((r) => {
    if (filter === 'active') return r.isActive && !r.isDone;
    if (filter === 'done') return r.isDone;
    return true;
  });

  const handleMarkDone = (id) => {
    Alert.alert(
      'Mark as Done',
      'Are you sure you want to mark this reminder as done?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Done',
          onPress: async () => {
            await markReminderDone(id);
            setExpandedId(null);
          },
        },
      ]
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteReminder(id);
            setExpandedId(null);
          },
        },
      ]
    );
  };

  const handleEdit = (reminder) => {
    // Navigate to edit mode (reuse NewReminder screen with pre-filled data)
    navigation.navigate('NewReminder', { editReminder: reminder });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      <AppHeader
        title="Manage Reminders"
        onBack={() => navigation.goBack()}
        rightIcon="home-outline"
        onRightPress={() => navigation.navigate('Home')}
      />

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {[
          { key: 'all', label: 'All' },
          { key: 'active', label: 'Active' },
          { key: 'done', label: 'Done' },
        ].map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilter(f.key)}
            activeOpacity={0.7}
            style={[
              styles.filterTab,
              filter === f.key && styles.filterTabActive,
            ]}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === f.key && styles.filterTabTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Stats bar */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{reminders.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.success }]}>
                {reminders.filter((r) => r.isActive && !r.isDone).length}
              </Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.textMuted }]}>
                {reminders.filter((r) => r.isDone).length}
              </Text>
              <Text style={styles.statLabel}>Done</Text>
            </View>
          </View>

          {/* Reminders list */}
          {filteredReminders.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons
                  name={filter === 'done' ? 'checkmark-done-circle-outline' : 'document-text-outline'}
                  size={48}
                  color={Colors.greenSoft}
                />
              </View>
              <Text style={styles.emptyTitle}>
                {filter === 'done'
                  ? 'No Completed Reminders'
                  : filter === 'active'
                  ? 'No Active Reminders'
                  : 'No Reminders Yet'}
              </Text>
              <Text style={styles.emptyText}>
                {filter === 'all'
                  ? "Create your first reminder from the home screen!"
                  : `No ${filter} reminders to show.`}
              </Text>
            </View>
          ) : (
            filteredReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                compact={false}
                expanded={expandedId === reminder.id}
                onPress={() =>
                  setExpandedId(expandedId === reminder.id ? null : reminder.id)
                }
                onMarkDone={() => handleMarkDone(reminder.id)}
                onEdit={() => handleEdit(reminder)}
              />
            ))
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  
  // Filter tabs
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  filterTab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.pill,
    marginRight: Spacing.sm,
    backgroundColor: Colors.chipBg,
    borderWidth: 1.5,
    borderColor: Colors.chipBgAlt,
  },
  filterTabActive: {
    backgroundColor: Colors.backgroundDark,
    borderColor: Colors.backgroundDark,
  },
  filterTabText: {
    ...Typography.chip,
    color: Colors.chipText,
  },
  filterTabTextActive: {
    color: Colors.textLight,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.section + 40,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    ...Shadows.soft,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.textDark,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.divider,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.section + 20,
  },
  emptyIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.textDark,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
