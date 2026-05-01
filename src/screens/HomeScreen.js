import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../theme/typography';
import { ReminderCard } from '../components/ReminderCard';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { nickname, activeReminders } = useApp();
  const insets = useSafeAreaInsets();

  // Animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const bannerSlide = useRef(new Animated.Value(30)).current;
  const listFade = useRef(new Animated.Value(0)).current;
  const fabScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.parallel([
        Animated.timing(headerFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(bannerSlide, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(listFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(fabScale, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <View style={styles.headerLeft}>
          <View style={styles.headerLogo}>
            <Text style={{ fontSize: 16 }}>☀️</Text>
          </View>
          <Text style={styles.appNameSmall}>Oye Sunn!</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AllReminders')}
            style={styles.headerIconBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="list-outline" size={22} color={Colors.textLight} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.headerIconBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={22} color={Colors.textLight} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.avatarBtn}
            activeOpacity={0.7}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {nickname ? nickname[0].toUpperCase() : '?'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Welcome Banner */}
      <Animated.View
        style={[
          styles.banner,
          Shadows.medium,
          {
            opacity: headerFade,
            transform: [{ translateY: bannerSlide }],
          },
        ]}
      >
        <View style={styles.bannerContent}>
          <View style={styles.bannerTextArea}>
            <Text style={styles.greetingText}>{getGreeting()},</Text>
            <Text style={styles.nicknameText}>{nickname}! 🌤️</Text>
            <Text style={styles.bannerSubtext}>
              {activeReminders.length === 0
                ? "You have no active reminders. Let's set one up!"
                : `You have ${activeReminders.length} active reminder${activeReminders.length !== 1 ? 's' : ''}`}
            </Text>
          </View>
          <View style={styles.bannerIcon}>
            <Ionicons name="sunny" size={44} color={Colors.accentOrange} />
          </View>
        </View>
      </Animated.View>

      {/* Content */}
      <Animated.View style={[styles.contentArea, { opacity: listFade }]}>
        {/* Section heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Active Reminders</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AllReminders')}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeReminders.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="location-outline" size={56} color={Colors.greenSoft} />
              </View>
              <Text style={styles.emptyTitle}>No Reminders Yet</Text>
              </View>
          ) : (
            activeReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                compact={true}
                onPress={() =>
                  navigation.navigate('AllReminders', { expandId: reminder.id })
                }
              />
            ))
          )}
        </ScrollView>
      </Animated.View>

      {/* FAB - Add New Reminder */}
      <Animated.View
        style={[
          styles.fabContainer,
          { bottom: insets.bottom + 20 },
          { transform: [{ scale: fabScale }] },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('NewReminder')}
          activeOpacity={0.85}
          style={[styles.fab, Shadows.strong]}
        >
          <Ionicons name="add" size={22} color={Colors.textOnOrange} />
          <Text style={styles.fabText}>Add New Reminder</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.accentOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  appNameSmall: {
    ...Typography.h3,
    color: Colors.textLight,
    fontWeight: '800',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  avatarBtn: {
    marginLeft: Spacing.xs,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.accentOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...Typography.h4,
    color: Colors.textOnOrange,
  },

  // Banner
  banner: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTextArea: {
    flex: 1,
  },
  greetingText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  nicknameText: {
    ...Typography.h1,
    color: Colors.textDark,
    marginTop: 2,
  },
  bannerSubtext: {
    ...Typography.small,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  bannerIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(232, 113, 58, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },

  // Content
  contentArea: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    borderTopLeftRadius: BorderRadius.xxl + 4,
    borderTopRightRadius: BorderRadius.xxl + 4,
    paddingTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textDark,
  },
  seeAllText: {
    ...Typography.bodyBold,
    color: Colors.accentOrange,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.section + 20,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    lineHeight: 22,
  },

  // FAB
  fabContainer: {
    position: 'absolute',
    right: Spacing.xl,
    zIndex: 10,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentOrange,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.pill,
  },
  fabText: {
    ...Typography.buttonSmall,
    color: Colors.textOnOrange,
    marginLeft: Spacing.sm,
  },
});
