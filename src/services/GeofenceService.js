import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GEOFENCE_TASK_NAME = 'OYEESUN_GEOFENCE_TASK';
const STORAGE_KEY = '@oyeesun_reminders';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request all required permissions for geofencing
 * Returns { location: bool, background: bool, notification: bool }
 */
export async function requestAllPermissions() {
  const result = { location: false, background: false, notification: false };

  // 1. Foreground location
  const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
  result.location = fgStatus === 'granted';

  if (!result.location) return result;

  // 2. Background location (required for geofencing)
  const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
  result.background = bgStatus === 'granted';

  // 3. Notifications
  const { status: notifStatus } = await Notifications.requestPermissionsAsync();
  result.notification = notifStatus === 'granted';

  return result;
}

/**
 * Check current permission status without prompting
 */
export async function checkPermissions() {
  const fg = await Location.getForegroundPermissionsAsync();
  const bg = await Location.getBackgroundPermissionsAsync();
  const notif = await Notifications.getPermissionsAsync();

  return {
    location: fg.status === 'granted',
    background: bg.status === 'granted',
    notification: notif.status === 'granted',
  };
}

/**
 * Register geofences for all active reminders that have coordinates
 */
export async function registerAllGeofences(reminders) {
  const permissions = await checkPermissions();

  if (!permissions.location || !permissions.background) {
    console.log('GeofenceService: Missing location permissions, skipping registration');
    return false;
  }

  // Filter to only active reminders with valid coordinates
  const activeRegions = reminders
    .filter((r) => r.isActive && !r.isDone && r.latitude && r.longitude)
    .map((r) => ({
      identifier: r.id,
      latitude: r.latitude,
      longitude: r.longitude,
      radius: r.radius || 100,
      notifyOnEnter: r.proximity === 'entering' || r.proximity === 'both',
      notifyOnExit: r.proximity === 'leaving' || r.proximity === 'both',
    }));

  if (activeRegions.length === 0) {
    // No regions to monitor — stop any existing monitoring
    await unregisterAllGeofences();
    return true;
  }

  try {
    await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, activeRegions);
    console.log(`GeofenceService: Registered ${activeRegions.length} geofence(s)`);
    return true;
  } catch (error) {
    console.error('GeofenceService: Failed to register geofences:', error);
    return false;
  }
}

/**
 * Stop all geofence monitoring
 */
export async function unregisterAllGeofences() {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(GEOFENCE_TASK_NAME);
    if (isRegistered) {
      await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
      console.log('GeofenceService: Unregistered all geofences');
    }
  } catch (error) {
    console.error('GeofenceService: Failed to unregister geofences:', error);
  }
}

/**
 * Fire a local notification for a triggered reminder
 */
async function fireNotification(reminder, eventType) {
  const isEnter = eventType === Location.GeofencingEventType.Enter;
  const action = isEnter ? 'arrived near' : 'left';

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '☀️ Oye Sunn!',
      body: `You've ${action} "${reminder.name}"${reminder.notes ? ` — ${reminder.notes}` : ''}`,
      data: {
        reminderId: reminder.id,
        latitude: reminder.latitude,
        longitude: reminder.longitude,
        type: 'geofence_trigger',
      },
      sound: true,
    },
    trigger: null, // Fire immediately
  });
}

/**
 * Check if current time falls within the reminder's active window
 */
function isWithinTimeWindow(reminder) {
  if (reminder.allDay) return true;

  const now = new Date();
  const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];

  // Check active days
  if (!reminder.alwaysActive && reminder.activeDays && !reminder.activeDays.includes(currentDay)) {
    return false;
  }

  // Check time range
  if (reminder.startTime && reminder.endTime) {
    const parseTime = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = parseTime(reminder.startTime);
    const endMinutes = parseTime(reminder.endTime);

    if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
      return false;
    }
  }

  return true;
}

// ─── BACKGROUND TASK DEFINITION ────────────────────────────────────────
// This MUST be defined at the top level (outside of any component)
// It runs even when the app is killed
TaskManager.defineTask(GEOFENCE_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('GeofenceService Background Task Error:', error);
    return;
  }

  if (!data) return;

  const { eventType, region } = data;
  const reminderId = region.identifier;

  try {
    // Load reminders from storage (we're in background, no React context available)
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const reminders = JSON.parse(stored);
    const reminder = reminders.find((r) => r.id === reminderId);

    if (!reminder || !reminder.isActive || reminder.isDone) return;

    // Check time constraints
    if (!isWithinTimeWindow(reminder)) {
      console.log(`GeofenceService: Reminder "${reminder.name}" skipped — outside time window`);
      return;
    }

    // Check proximity match
    const isEnter = eventType === Location.GeofencingEventType.Enter;
    const isExit = eventType === Location.GeofencingEventType.Exit;

    const shouldNotify =
      (isEnter && (reminder.proximity === 'entering' || reminder.proximity === 'both')) ||
      (isExit && (reminder.proximity === 'leaving' || reminder.proximity === 'both'));

    if (shouldNotify) {
      await fireNotification(reminder, eventType);
      console.log(`GeofenceService: Notification fired for "${reminder.name}" (${isEnter ? 'ENTER' : 'EXIT'})`);
    }
  } catch (err) {
    console.error('GeofenceService: Error in background task:', err);
  }
});

export default {
  requestAllPermissions,
  checkPermissions,
  registerAllGeofences,
  unregisterAllGeofences,
  GEOFENCE_TASK_NAME,
};
