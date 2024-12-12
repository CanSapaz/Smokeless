import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { storage } from '../services/storage';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import * as Updates from 'expo-updates';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type SettingItemProps = {
  icon: string;
  title: string;
  onPress?: () => void;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  showArrow?: boolean;
  destructive?: boolean;
  subtitle?: string;
};

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  onPress,
  value,
  onValueChange,
  showArrow = true,
  destructive = false,
  subtitle,
}) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: theme.cardBorder }]}
      onPress={onPress}
      disabled={!onPress && !onValueChange}
    >
      <View style={styles.settingItemLeft}>
        <Ionicons
          name={icon as any}
          size={24}
          color={destructive ? theme.danger : theme.text}
        />
        <Text style={[
          styles.settingItemText,
          { color: destructive ? theme.danger : theme.text }
        ]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[
            styles.settingItemSubtitle,
            { color: theme.textSecondary }
          ]}>
            {subtitle}
          </Text>
        )}
      </View>
      {onValueChange && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.cardBorder, true: theme.primary }}
          thumbColor={value ? '#fff' : '#f4f3f4'}
        />
      )}
      {showArrow && !onValueChange && (
        <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
      )}
    </TouchableOpacity>
  );
};

export const SettingsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const { theme, toggleTheme, isDark } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleReset = async () => {
    Alert.alert(
      t('settings.reset.title'),
      t('settings.reset.message'),
      [
        {
          text: t('settings.reset.cancel'),
          style: "cancel"
        },
        {
          text: t('settings.reset.confirm'),
          style: "destructive",
          onPress: async () => {
            await storage.resetAllData();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          }
        }
      ]
    );
  };

  const handleLanguageChange = () => {
    Alert.alert(
      t('settings.language.title'),
      t('settings.language.message'),
      [
        {
          text: "Türkçe",
          onPress: () => setLanguage('TR')
        },
        {
          text: "English",
          onPress: () => setLanguage('EN')
        }
      ]
    );
  };

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert(
          t('settings.update.title'),
          t('settings.update.message'),
          [
            {
              text: t('settings.update.cancel'),
              style: "cancel"
            },
            {
              text: t('settings.update.confirm'),
              onPress: async () => {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
              }
            }
          ]
        );
      } else {
        Alert.alert(t('settings.update.title'), t('settings.update.notAvailable'));
      }
    } catch (error) {
      Alert.alert(t('settings.update.error.title'), t('settings.update.error.message'));
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t('settings.sections.account')}</Text>
        <SettingItem
          icon="person-outline"
          title={t('settings.profile')}
          onPress={() => navigation.navigate('Profile')}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t('settings.sections.general')}</Text>
        <SettingItem
          icon="notifications-outline"
          title={t('settings.notifications')}
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
        <SettingItem
          icon={isDark ? "moon" : "sunny"}
          title={t('settings.darkMode')}
          onPress={toggleTheme}
          value={isDark}
          onValueChange={toggleTheme}
        />
        <SettingItem
          icon="language-outline"
          title={t('settings.language.title')}
          subtitle={language === 'TR' ? 'Türkçe' : 'English'}
          onPress={handleLanguageChange}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t('settings.sections.about')}</Text>
        <SettingItem
          icon="information-circle-outline"
          title={t('settings.about.title')}
          onPress={() => Alert.alert("Smokeless", `${t('settings.version')} 1.0.0`)}
        />
        <SettingItem
          icon="refresh-outline"
          title={t('settings.update.title')}
          onPress={checkForUpdates}
        />
        <SettingItem
          icon="mail-outline"
          title={t('settings.feedback.title')}
          onPress={() => Alert.alert(t('settings.feedback.title'), t('settings.feedback.message'))}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t('settings.sections.dangerZone')}</Text>
        <SettingItem
          icon="trash-outline"
          title={t('settings.reset.title')}
          onPress={handleReset}
          destructive
        />
      </View>

      <Text style={[styles.version, { color: theme.textSecondary }]}>{t('settings.version')} 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  settingItemSubtitle: {
    fontSize: 14,
    marginLeft: 12,
    color: '#666',
  },
  version: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 14,
  },
});
