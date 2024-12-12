import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import * as Haptics from 'expo-haptics';
import { storage } from '../services/storage';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  unit: string;
  type: 'money' | 'cigarettes' | 'time' | 'days';
  unlocked: boolean;
  progress: number;
}

export const AchievementsScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState({
    moneySaved: 0,
    cigarettesNotSmoked: 0,
    timeRegained: 0,
    daysSince: 0,
  });

  // Başarımları tanımla
  const achievementsList: Achievement[] = [
    // Para Biriktirme Başarımları
    {
      id: 'money_1',
      title: t('achievements.money_1.title'),
      description: t('achievements.money_1.description'),
      icon: 'wallet-outline',
      target: 100,
      unit: '₺',
      type: 'money',
      unlocked: false,
      progress: 0,
    },
    {
      id: 'money_2',
      title: t('achievements.money_2.title'),
      description: t('achievements.money_2.description'),
      icon: 'cash-outline',
      target: 500,
      unit: '₺',
      type: 'money',
      unlocked: false,
      progress: 0,
    },
    {
      id: 'money_3',
      title: t('achievements.money_3.title'),
      description: t('achievements.money_3.description'),
      icon: 'diamond-outline',
      target: 1000,
      unit: '₺',
      type: 'money',
      unlocked: false,
      progress: 0,
    },
    {
      id: 'money_4',
      title: t('achievements.money_4.title'),
      description: t('achievements.money_4.description'),
      icon: 'gift-outline',
      target: 2500,
      unit: '₺',
      type: 'money',
      unlocked: false,
      progress: 0,
    },
    {
      id: 'money_5',
      title: t('achievements.money_5.title'),
      description: t('achievements.money_5.description'),
      icon: 'briefcase-outline',
      target: 5000,
      unit: '₺',
      type: 'money',
      unlocked: false,
      progress: 0,
    },

    // İçilmeyen Sigara Başarımları
    {
      id: 'cigarettes_1',
      title: t('achievements.cigarettes_1.title'),
      description: t('achievements.cigarettes_1.description'),
      icon: 'leaf-outline',
      target: 50,
      unit: '',
      type: 'cigarettes',
      unlocked: false,
      progress: 0,
    },
    {
      id: 'cigarettes_2',
      title: t('achievements.cigarettes_2.title'),
      description: t('achievements.cigarettes_2.description'),
      icon: 'heart-outline',
      target: 100,
      unit: '',
      type: 'cigarettes',
      unlocked: false,
      progress: 0,
    },
    {
      id: 'cigarettes_3',
      title: t('achievements.cigarettes_3.title'),
      description: t('achievements.cigarettes_3.description'),
      icon: 'fitness-outline',
      target: 250,
      unit: '',
      type: 'cigarettes',
      unlocked: false,
      progress: 0,
    },
    {
      id: 'cigarettes_4',
      title: t('achievements.cigarettes_4.title'),
      description: t('achievements.cigarettes_4.description'),
      icon: 'shield-checkmark-outline',
      target: 500,
      unit: '',
      type: 'cigarettes',
      unlocked: false,
      progress: 0,
    },
    {
      id: 'cigarettes_5',
      title: t('achievements.cigarettes_5.title'),
      description: t('achievements.cigarettes_5.description'),
      icon: 'medal-outline',
      target: 1000,
      unit: '',
      type: 'cigarettes',
      unlocked: false,
      progress: 0,
    },
    {
      id: 'cigarettes_6',
      title: t('achievements.cigarettes_6.title'),
      description: t('achievements.cigarettes_6.description'),
      icon: 'ribbon-outline',
      target: 2000,
      unit: '',
      type: 'cigarettes',
      unlocked: false,
      progress: 0,
    },

    // Sigarasız Gün Başarımları
    {
      id: 'days_1',
      title: t('achievements.days_1.title'),
      description: t('achievements.days_1.description'),
      icon: 'sunny-outline',
      target: 1,
      unit: '',
      type: 'days',
      unlocked: false,
      progress: 0,
    },
    {
      id: 'days_2',
      title: t('achievements.days_2.title'),
      description: t('achievements.days_2.description'),
      icon: 'star-outline',
      target: 3,
      unit: '',
      type: 'days',
      unlocked: false,
      progress: 0,
    },
    {
      id: 'days_3',
      title: t('achievements.days_3.title'),
      description: t('achievements.days_3.description'),
      icon: 'calendar-outline',
      target: 7,
      unit: '',
      type: 'days',
      unlocked: false,
      progress: 0,
    },
    {
      id: 'days_4',
      title: t('achievements.days_4.title'),
      description: t('achievements.days_4.description'),
      icon: 'trophy-outline',
      target: 14,
      unit: '',
      type: 'days',
      unlocked: false,
      progress: 0,
    },
    {
      id: 'days_5',
      title: t('achievements.days_5.title'),
      description: t('achievements.days_5.description'),
      icon: 'moon-outline',
      target: 30,
      unit: '',
      type: 'days',
      unlocked: false,
      progress: 0,
    },
    {
      id: 'days_6',
      title: t('achievements.days_6.title'),
      description: t('achievements.days_6.description'),
      icon: 'earth-outline',
      target: 90,
      unit: '',
      type: 'days',
      unlocked: false,
      progress: 0,
    },
    {
      id: 'days_7',
      title: t('achievements.days_7.title'),
      description: t('achievements.days_7.description'),
      icon: 'planet-outline',
      target: 180,
      unit: '',
      type: 'days',
      unlocked: false,
      progress: 0,
    },
    {
      id: 'days_8',
      title: t('achievements.days_8.title'),
      description: t('achievements.days_8.description'),
      icon: 'infinite-outline',
      target: 365,
      unit: '',
      type: 'days',
      unlocked: false,
      progress: 0,
    },
  ];

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const quitDate = await storage.getQuitDate();
    const profile = await storage.getUserProfile();

    if (quitDate && profile) {
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - quitDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const MINUTES_PER_CIGARETTE = 10;

      const currentStats = {
        daysSince: diffDays,
        moneySaved: diffDays * (profile.cigarettesPerDay / profile.cigarettesPerPack) * profile.pricePerPack,
        cigarettesNotSmoked: diffDays * profile.cigarettesPerDay,
        timeRegained: (diffDays * profile.cigarettesPerDay * MINUTES_PER_CIGARETTE) / 60,
      };

      setStats(currentStats);
      updateAchievements(currentStats);
    }
  };

  const updateAchievements = (currentStats: typeof stats) => {
    const updatedAchievements = achievementsList.map(achievement => {
      let progress = 0;
      switch (achievement.type) {
        case 'money':
          progress = (currentStats.moneySaved / achievement.target) * 100;
          break;
        case 'cigarettes':
          progress = (currentStats.cigarettesNotSmoked / achievement.target) * 100;
          break;
        case 'days':
          progress = (currentStats.daysSince / achievement.target) * 100;
          break;
      }

      const wasLocked = !achievement.unlocked;
      const unlocked = progress >= 100;

      // Yeni başarım açıldığında haptic feedback ver
      if (wasLocked && unlocked) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      return {
        ...achievement,
        unlocked,
        progress: Math.min(progress, 100),
      };
    });

    setAchievements(updatedAchievements);
  };

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const progressWidth = new Animated.Value(0);
    const SUCCESS_COLOR = '#4CAF50'; // Başarı yeşili

    useEffect(() => {
      Animated.timing(progressWidth, {
        toValue: achievement.progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, [achievement.progress]);

    const progressBarWidth = progressWidth.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    });

    return (
      <TouchableOpacity
        style={[styles.achievementCard, { 
          backgroundColor: theme.card,
          borderColor: achievement.unlocked ? SUCCESS_COLOR : theme.cardBorder,
          opacity: achievement.unlocked ? 1 : 0.7,
        }]}
        onPress={() => {
          if (achievement.unlocked) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }}
      >
        <View style={styles.achievementHeader}>
          <View style={[styles.iconContainer, { 
            backgroundColor: achievement.unlocked ? SUCCESS_COLOR + '20' : theme.textSecondary + '20'
          }]}>
            <Ionicons 
              name={achievement.icon as any} 
              size={24} 
              color={achievement.unlocked ? SUCCESS_COLOR : theme.textSecondary} 
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.achievementTitle, { color: theme.text }]}>
              {achievement.title}
            </Text>
            <Text style={[styles.achievementDescription, { color: theme.textSecondary }]}>
              {achievement.description}
            </Text>
          </View>
          {achievement.unlocked && (
            <Ionicons name="checkmark" size={24} color={SUCCESS_COLOR} />
          )}
        </View>
        
        <View style={[styles.progressBar, { backgroundColor: theme.cardBorder }]}>
          <Animated.View 
            style={[
              styles.progressFill,
              { 
                width: progressBarWidth,
                backgroundColor: achievement.unlocked ? SUCCESS_COLOR : theme.textSecondary,
              }
            ]} 
          />
        </View>
        
        <Text style={[styles.progressText, { 
          color: achievement.unlocked ? SUCCESS_COLOR : theme.textSecondary 
        }]}>
          {achievement.progress.toFixed(0)}%
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{t('achievements.title')}</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {t('achievements.subtitle')}
        </Text>
      </View>

      <View style={styles.achievementsContainer}>
        {/* Açılan başarımlar */}
        {achievements
          .filter(a => a.unlocked)
          .sort((a, b) => b.target - a.target)
          .map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}

        {/* Açılmayan başarımlar (ilerlemeye göre sıralı) */}
        {achievements
          .filter(a => !a.unlocked)
          .sort((a, b) => b.progress - a.progress)
          .map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  achievementsContainer: {
    padding: 20,
    gap: 15,
  },
  achievementCard: {
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right',
  },
});
