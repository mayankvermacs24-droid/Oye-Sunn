import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../theme/typography';
import AppHeader from '../components/AppHeader';
import { PillButton } from '../components/Buttons';
import { FormInput, ToggleRow } from '../components/FormElements';
import { useApp } from '../context/AppContext';

export default function SettingsScreen({ navigation }) {
  const { nickname, settings, updateNickname, updateSettings, logout } = useApp();
  const insets = useSafeAreaInsets();
  const [editedNickname, setEditedNickname] = useState(nickname);
  const [hasChanges, setHasChanges] = useState(false);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSaveNickname = async () => {
    if (editedNickname.trim().length > 0) {
      await updateNickname(editedNickname.trim());
      setHasChanges(false);
      Alert.alert('Success', 'Nickname updated!');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out? All your data will be cleared.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <AppHeader
        title="User Settings"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Profile Section */}
          <View style={[styles.profileCard, Shadows.medium]}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>
                {nickname ? nickname[0].toUpperCase() : '?'}
              </Text>
            </View>
            <View style={styles.profileDetails}>
              <FormInput
                label="Nickname"
                value={editedNickname}
                onChangeText={(text) => {
                  setEditedNickname(text);
                  setHasChanges(text.trim() !== nickname);
                }}
                placeholder="Your nickname"
                maxLength={20}
              />
              {hasChanges && (
                <PillButton
                  title="Save Changes"
                  icon="checkmark"
                  variant="orange"
                  onPress={handleSaveNickname}
                  style={{ alignSelf: 'flex-start' }}
                />
              )}
            </View>
          </View>

          {/* Notification Settings */}
          <Text style={styles.sectionTitle}>Notification Settings</Text>

          <View style={[styles.settingsCard, Shadows.soft]}>
            <ToggleRow
              label="Location Pings"
              description="Get notified when entering or leaving a location"
              value={settings.locationPings}
              onValueChange={(val) => updateSettings({ locationPings: val })}
            />
            <ToggleRow
              label="Time Constraints"
              description="Only trigger reminders within set time windows"
              value={settings.timeConstraints}
              onValueChange={(val) => updateSettings({ timeConstraints: val })}
            />
            <ToggleRow
              label="Allow Push Notifications"
              description="Enable push notifications for reminders"
              value={settings.pushNotifications}
              onValueChange={(val) => updateSettings({ pushNotifications: val })}
              style={{ borderBottomWidth: 0 }}
            />
          </View>

          {/* App Info */}
          <Text style={styles.sectionTitle}>About</Text>

          <View style={[styles.settingsCard, Shadows.soft]}>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.textMuted} />
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Ionicons name="sunny-outline" size={20} color={Colors.textMuted} />
              <Text style={styles.infoLabel}>App</Text>
              <Text style={styles.infoValue}>Oye sunn!</Text>
            </View>
          </View>

          {/* Logout */}
          <View style={styles.logoutArea}>
            <PillButton
              title="Log Out"
              icon="log-out-outline"
              variant="dark"
              onPress={handleLogout}
            />
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.section + 40,
  },

  // Profile
  profileCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accentOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.medium,
  },
  avatarLargeText: {
    ...Typography.h1,
    color: Colors.textOnOrange,
    fontSize: 32,
  },
  profileDetails: {
    width: '100%',
  },

  // Sections
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textDark,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  settingsCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  infoLabel: {
    ...Typography.body,
    color: Colors.textDark,
    flex: 1,
    marginLeft: Spacing.md,
  },
  infoValue: {
    ...Typography.body,
    color: Colors.textMuted,
  },

  // Logout
  logoutArea: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
});
