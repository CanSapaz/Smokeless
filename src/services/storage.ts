import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  QUIT_DATE: '@smokeless_quit_date',
  USER_PROFILE: '@smokeless_user_profile',
  DAILY_LOGS: '@smokeless_daily_logs',
  ONBOARDING_COMPLETED: '@smokeless_onboarding_completed',
};

export interface UserProfile {
  name: string;
  cigarettesPerDay: number;
  pricePerPack: number;
  cigarettesPerPack: number;
  smokingYears: number;
  goals: string[];
}

export interface DailyLog {
  date: string;
  cravings: number;
  mood: 1 | 2 | 3 | 4 | 5;
  notes: string;
}

export const storage = {
  async saveQuitDate(date: Date) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.QUIT_DATE, date.toISOString());
    } catch (error) {
      console.error('Error saving quit date:', error);
    }
  },

  async getQuitDate(): Promise<Date | null> {
    try {
      const date = await AsyncStorage.getItem(STORAGE_KEYS.QUIT_DATE);
      return date ? new Date(date) : null;
    } catch (error) {
      console.error('Error getting quit date:', error);
      return null;
    }
  },

  async saveUserProfile(profile: UserProfile) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  },

  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const profile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  async saveDailyLog(log: DailyLog) {
    try {
      const existingLogsStr = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
      const existingLogs: DailyLog[] = existingLogsStr ? JSON.parse(existingLogsStr) : [];
      const updatedLogs = [...existingLogs, log];
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Error saving daily log:', error);
    }
  },

  async getDailyLogs(): Promise<DailyLog[]> {
    try {
      const logs = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Error getting daily logs:', error);
      return [];
    }
  },

  async setOnboardingCompleted(completed: boolean) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, JSON.stringify(completed));
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  },

  async isOnboardingCompleted(): Promise<boolean> {
    try {
      const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return completed ? JSON.parse(completed) : false;
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      return false;
    }
  },

  async resetAllData() {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  },
};
