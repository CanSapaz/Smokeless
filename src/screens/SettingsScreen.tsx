import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { storage } from '../services/storage';
import { useTheme } from '../context/ThemeContext';
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
};

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  onPress,
  value,
  onValueChange,
  showArrow = true,
  destructive = false,
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
  const { isDark, toggleTheme, theme } = useTheme();

  const handleReset = async () => {
    Alert.alert(
      "Uygulamayı Sıfırla",
      "Tüm verileriniz silinecek ve başlangıç ekranına yönlendirileceksiniz. Emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Sıfırla",
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

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert(
          "Güncelleme Mevcut",
          "Yeni bir güncelleme mevcut. Şimdi yüklemek ister misiniz?",
          [
            {
              text: "Daha Sonra",
              style: "cancel"
            },
            {
              text: "Güncelle",
              onPress: async () => {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
              }
            }
          ]
        );
      } else {
        Alert.alert("Güncelleme Yok", "En son sürümü kullanıyorsunuz.");
      }
    } catch (error) {
      Alert.alert("Hata", "Güncelleme kontrol edilirken bir hata oluştu.");
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Hesap</Text>
        <SettingItem
          icon="person-outline"
          title="Profil Bilgileri"
          onPress={() => navigation.navigate('Profile')}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Genel</Text>
        <SettingItem
          icon="notifications-outline"
          title="Bildirimler"
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
        <SettingItem
          icon="moon-outline"
          title="Karanlık Mod"
          value={isDark}
          onValueChange={toggleTheme}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Uygulama</Text>
        <SettingItem
          icon="information-circle-outline"
          title="Uygulama Hakkında"
          onPress={() => Alert.alert("Smokeless", "Versiyon 1.0.1")}
        />
        <SettingItem
          icon="refresh-outline"
          title="Güncellemeleri Kontrol Et"
          onPress={checkForUpdates}
        />
        <SettingItem
          icon="mail-outline"
          title="Geri Bildirim Gönder"
          onPress={() => Alert.alert("Yakında", "Bu özellik yakında eklenecek")}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Tehlike Bölgesi</Text>
        <SettingItem
          icon="trash-outline"
          title="Tüm Verileri Sıfırla"
          onPress={handleReset}
          destructive
        />
      </View>

      <Text style={[styles.version, { color: theme.textSecondary }]}>Versiyon 1.0.1</Text>
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
  version: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 14,
  },
});
