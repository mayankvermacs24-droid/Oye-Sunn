import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../theme/typography';
import AppHeader from '../components/AppHeader';
import { ActionButton } from '../components/Buttons';
import { FormInput, ToggleRow, SectionLabel } from '../components/FormElements';
import { ChipGroup } from '../components/Chips';
import ScrollTimePicker from '../components/ScrollTimePicker';
import { SelectionGrid } from '../components/SelectionCard';
import LocationPicker from '../components/LocationPicker';
import { useApp } from '../context/AppContext';

const DAY_OPTIONS = [
  { label: 'Sun', value: 'Sun' },
  { label: 'Mon', value: 'Mon' },
  { label: 'Tue', value: 'Tue' },
  { label: 'Wed', value: 'Wed' },
  { label: 'Thu', value: 'Thu' },
  { label: 'Fri', value: 'Fri' },
  { label: 'Sat', value: 'Sat' },
];

const PROXIMITY_OPTIONS = [
  { label: 'Entering', value: 'entering', icon: 'log-in-outline' },
  { label: 'Leaving', value: 'leaving', icon: 'log-out-outline' },
  { label: 'Both', value: 'both', icon: 'swap-horizontal-outline' },
];



export default function NewReminderScreen({ navigation }) {
  const { addReminder } = useApp();
  const insets = useSafeAreaInsets();

  // Form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [proximity, setProximity] = useState('');
  const [radius, setRadius] = useState(200);
  const [notes, setNotes] = useState('');
  const [allDay, setAllDay] = useState(true);
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [activeDays, setActiveDays] = useState([]);
  const [alwaysActive, setAlwaysActive] = useState(true);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLocationChange = ({ name: locName, latitude: lat, longitude: lng }) => {
    setLocation(locName || '');
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter a reminder name.');
      return;
    }
    if (!location.trim() || !latitude || !longitude) {
      Alert.alert('Required', 'Please select a location from the search or use your current location.');
      return;
    }
    if (!proximity) {
      Alert.alert('Required', 'Please select a proximity type.');
      return;
    }

    const reminder = {
      name: name.trim(),
      location: location.trim(),
      latitude,
      longitude,
      proximity,
      radius: radius || 200,
      notes: notes.trim(),
      allDay,
      startTime: allDay ? null : startTime,
      endTime: allDay ? null : endTime,
      activeDays: alwaysActive ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : activeDays,
      alwaysActive,
    };

    await addReminder(reminder);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      <AppHeader
        title="Set New Reminder"
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Reminder Name */}
            <FormInput
              label="Reminder Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Pick up dry cleaning"
              maxLength={50}
            />

            {/* Location with Map & Radius */}
            <SectionLabel label="Location" />
            <LocationPicker
              locationName={location}
              onLocationChange={handleLocationChange}
              radius={radius}
              onRadiusChange={setRadius}
            />

            {/* Proximity Selection */}
            <SectionLabel label="Proximity Type" />
            <SelectionGrid
              items={PROXIMITY_OPTIONS}
              selected={proximity}
              onSelect={setProximity}
              columns={3}
              style={{ marginBottom: Spacing.lg }}
            />

            {/* Notes */}
            <FormInput
              label="Notes (optional)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Any additional details..."
              multiline
              maxLength={200}
            />

            {/* Time Constraints */}
            <SectionLabel label="Time Constraints" />
            
            <View style={[styles.card, Shadows.soft]}>
              <ToggleRow
                label="All Day"
                description="Trigger at any time of day"
                value={allDay}
                onValueChange={setAllDay}
                style={{ borderBottomWidth: 0 }}
              />

              {!allDay && (
                <View style={styles.timeSection}>
                  <ScrollTimePicker
                    label="Start Time"
                    value={startTime}
                    onChange={setStartTime}
                  />
                  <View style={styles.timeDivider} />
                  <ScrollTimePicker
                    label="End Time"
                    value={endTime}
                    onChange={setEndTime}
                  />
                </View>
              )}
            </View>

            {/* Active Days */}
            <SectionLabel label="Active Days" />
            
            <View style={[styles.card, Shadows.soft]}>
              <ToggleRow
                label="Always Active"
                description="Keep this reminder active indefinitely"
                value={alwaysActive}
                onValueChange={setAlwaysActive}
                style={{ borderBottomWidth: 0 }}
              />

              {!alwaysActive && (
                <View style={styles.daysSection}>
                  <Text style={styles.timeLabel}>Select Days</Text>
                  <ChipGroup
                    items={DAY_OPTIONS}
                    selected={activeDays}
                    onSelect={setActiveDays}
                    multiSelect
                  />
                </View>
              )}
            </View>

            {/* Save Button */}
            <View style={styles.saveButtonArea}>
              <ActionButton
                title="Save Reminder"
                icon="checkmark-circle"
                onPress={handleSave}
                style={{ width: '100%' }}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  timeSection: {
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  timeDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.sm,
  },
  daysSection: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  timeLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  saveButtonArea: {
    marginTop: Spacing.xxl,
    alignItems: 'center',
  },
});
