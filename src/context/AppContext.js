import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerAllGeofences } from '../services/GeofenceService';

const AppContext = createContext();

const STORAGE_KEYS = {
  NICKNAME: '@oyeesun_nickname',
  REMINDERS: '@oyeesun_reminders',
  SETTINGS: '@oyeesun_settings',
};

const defaultSettings = {
  locationPings: true,
  timeConstraints: true,
  pushNotifications: true,
};

export function AppProvider({ children }) {
  const [nickname, setNickname] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData();
  }, []);

  const loadPersistedData = async () => {
    try {
      const [savedNickname, savedReminders, savedSettings] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.NICKNAME),
        AsyncStorage.getItem(STORAGE_KEYS.REMINDERS),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
      ]);

      if (savedNickname) {
        setNickname(savedNickname);
        setIsRegistered(true);
      }
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NICKNAME, name);
      setNickname(name);
      setIsRegistered(true);
    } catch (error) {
      console.log('Error saving nickname:', error);
    }
  };

  const updateNickname = async (name) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NICKNAME, name);
      setNickname(name);
    } catch (error) {
      console.log('Error updating nickname:', error);
    }
  };

  const addReminder = async (reminder) => {
    const newReminder = {
      ...reminder,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isActive: true,
      isDone: false,
    };
    const updated = [...reminders, newReminder];
    setReminders(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
      // Re-register geofences with the updated list
      await registerAllGeofences(updated);
    } catch (error) {
      console.log('Error saving reminder:', error);
    }
    return newReminder;
  };

  const updateReminder = async (id, updates) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, ...updates } : r
    );
    setReminders(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
      await registerAllGeofences(updated);
    } catch (error) {
      console.log('Error updating reminder:', error);
    }
  };

  const deleteReminder = async (id) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
      await registerAllGeofences(updated);
    } catch (error) {
      console.log('Error deleting reminder:', error);
    }
  };

  const markReminderDone = async (id) => {
    await updateReminder(id, { isDone: true, isActive: false });
  };

  const updateSettings = async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.NICKNAME,
        STORAGE_KEYS.REMINDERS,
        STORAGE_KEYS.SETTINGS,
      ]);
      setNickname('');
      setIsRegistered(false);
      setReminders([]);
      setSettings(defaultSettings);
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  const activeReminders = reminders.filter((r) => r.isActive && !r.isDone);

  return (
    <AppContext.Provider
      value={{
        nickname,
        isRegistered,
        reminders,
        activeReminders,
        settings,
        loading,
        register,
        updateNickname,
        addReminder,
        updateReminder,
        deleteReminder,
        markReminderDone,
        updateSettings,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
