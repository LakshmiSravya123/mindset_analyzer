import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserSettings {
  notifications_enabled: boolean;
  daily_reminder: boolean;
  reminder_time: string;
  data_collection_frequency: 'hourly' | 'daily' | 'weekly';
  theme: 'light' | 'dark' | 'system';
  language: string;
}

const SettingsScreen = () => {
  const [settings, setSettings] = useState<UserSettings>({
    notifications_enabled: true,
    daily_reminder: true,
    reminder_time: '09:00',
    data_collection_frequency: 'daily',
    theme: 'system',
    language: 'en',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const savedSettings = await AsyncStorage.getItem('user_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      } else {
        // Fetch default settings from API
        const response = await axios.get('http://localhost:5000/api/settings');
        setSettings(response.data);
        await AsyncStorage.setItem('user_settings', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await axios.post('http://localhost:5000/api/settings', settings);
      await AsyncStorage.setItem('user_settings', JSON.stringify(settings));
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const renderSettingItem = (
    title: string,
    description: string,
    icon: string,
    children: React.ReactNode
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingHeader}>
        <Icon name={icon} size={24} color="#007AFF" />
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      {children}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={saveSettings}
          disabled={saving}
        >
          <Icon name="content-save" size={24} color="#ffffff" />
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {renderSettingItem(
          'Push Notifications',
          'Receive notifications about your mental state',
          'bell-outline',
          <Switch
            value={settings.notifications_enabled}
            onValueChange={(value) =>
              setSettings({ ...settings, notifications_enabled: value })
            }
          />
        )}
        {renderSettingItem(
          'Daily Reminder',
          'Get reminded to log your daily mental state',
          'clock-outline',
          <Switch
            value={settings.daily_reminder}
            onValueChange={(value) =>
              setSettings({ ...settings, daily_reminder: value })
            }
          />
        )}
        {settings.daily_reminder && (
          <View style={styles.timePickerContainer}>
            <TextInput
              style={styles.timeInput}
              value={settings.reminder_time}
              onChangeText={(value) =>
                setSettings({ ...settings, reminder_time: value })
              }
              placeholder="HH:MM"
            />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Collection</Text>
        {renderSettingItem(
          'Collection Frequency',
          'How often to collect mental state data',
          'database-outline',
          <View style={styles.frequencyContainer}>
            {['hourly', 'daily', 'weekly'].map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.frequencyButton,
                  settings.data_collection_frequency === freq &&
                    styles.frequencyButtonActive,
                ]}
                onPress={() =>
                  setSettings({
                    ...settings,
                    data_collection_frequency: freq as UserSettings['data_collection_frequency'],
                  })
                }
              >
                <Text
                  style={[
                    styles.frequencyText,
                    settings.data_collection_frequency === freq &&
                      styles.frequencyTextActive,
                  ]}
                >
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        {renderSettingItem(
          'Theme',
          'Choose your preferred theme',
          'theme-light-dark',
          <View style={styles.themeContainer}>
            {['light', 'dark', 'system'].map((theme) => (
              <TouchableOpacity
                key={theme}
                style={[
                  styles.themeButton,
                  settings.theme === theme && styles.themeButtonActive,
                ]}
                onPress={() =>
                  setSettings({
                    ...settings,
                    theme: theme as UserSettings['theme'],
                  })
                }
              >
                <Icon
                  name={
                    theme === 'light'
                      ? 'white-balance-sunny'
                      : theme === 'dark'
                      ? 'moon-waning-crescent'
                      : 'theme-light-dark'
                  }
                  size={20}
                  color={settings.theme === theme ? '#ffffff' : '#6c757d'}
                />
                <Text
                  style={[
                    styles.themeText,
                    settings.theme === theme && styles.themeTextActive,
                  ]}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language</Text>
        {renderSettingItem(
          'App Language',
          'Select your preferred language',
          'translate',
          <View style={styles.languageContainer}>
            <TextInput
              style={styles.languageInput}
              value={settings.language}
              onChangeText={(value) =>
                setSettings({ ...settings, language: value })
              }
              placeholder="Language code (e.g., en, es, fr)"
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  saveButtonText: {
    color: '#ffffff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
  },
  section: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 16,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  timePickerContainer: {
    marginTop: 8,
    marginLeft: 36,
  },
  timeInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    width: 100,
  },
  frequencyContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 4,
  },
  frequencyButtonActive: {
    backgroundColor: '#007AFF',
  },
  frequencyText: {
    textAlign: 'center',
    color: '#6c757d',
  },
  frequencyTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  themeContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 4,
  },
  themeButtonActive: {
    backgroundColor: '#007AFF',
  },
  themeText: {
    marginLeft: 8,
    color: '#6c757d',
  },
  themeTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  languageContainer: {
    marginTop: 8,
  },
  languageInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
});

export default SettingsScreen; 