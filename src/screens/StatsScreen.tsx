import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../services/storage';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import type { TranslationPath } from '../hooks/useTranslation';

type BenefitId = '20m' | '8h' | '24h' | '48h' | '72h' | '2w' | '1m' | '3m' | '6m' | '1y';

interface HealthBenefit {
  id: BenefitId;
  title: string;
  timeInMinutes: number;
  icon: string;
}

const healthBenefits: HealthBenefit[] = [
  {
    id: '20m',
    title: 'İlk Adım',
    timeInMinutes: 20,
    icon: 'heart-outline'
  },
  {
    id: '8h',
    title: 'Temiz Kan',
    timeInMinutes: 480,
    icon: 'water-outline'
  },
  {
    id: '24h',
    title: 'Güçlü Kalp',
    timeInMinutes: 1440,
    icon: 'fitness-outline'
  },
  {
    id: '48h',
    title: 'Yeni Duygular',
    timeInMinutes: 2880,
    icon: 'restaurant-outline'
  },
  {
    id: '72h',
    title: 'Temiz Nefes',
    timeInMinutes: 4320,
    icon: 'leaf-outline'
  },
  {
    id: '2w',
    title: 'Rahat Akciğer',
    timeInMinutes: 20160,
    icon: 'medkit-outline'
  },
  {
    id: '1m',
    title: 'Sağlıklı Yaşam',
    timeInMinutes: 43200,
    icon: 'pulse-outline'
  },
  {
    id: '3m',
    title: 'Yeni Ben',
    timeInMinutes: 129600,
    icon: 'shield-checkmark-outline'
  }
];

const getBenefitTranslationKey = (id: BenefitId, key: 'title' | 'description'): TranslationPath => {
  return `stats.benefits.${id}.${key}` as TranslationPath;
};

export const StatsScreen = () => {
  const [stats, setStats] = useState({
    daysSince: 0,
    moneySaved: 0,
    cigarettesNotSmoked: 0,
    timeRegained: 0,
  });
  const [quitDate, setQuitDate] = useState<Date | null>(null);

  const { theme } = useTheme();
  const { t } = useTranslation();
  const MINUTES_PER_CIGARETTE = 10;
  const SUCCESS_COLOR = '#4CAF50';

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const savedQuitDate = await storage.getQuitDate();
    const profile = await storage.getUserProfile();
    
    if (savedQuitDate) {
      setQuitDate(savedQuitDate);
    }

    if (savedQuitDate && profile) {
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - savedQuitDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setStats({
        daysSince: diffDays,
        moneySaved: (diffDays * (profile.cigarettesPerDay / profile.cigarettesPerPack) * profile.pricePerPack),
        cigarettesNotSmoked: diffDays * profile.cigarettesPerDay,
        timeRegained: (diffDays * profile.cigarettesPerDay * MINUTES_PER_CIGARETTE) / 60,
      });
    }
  };

  const StatItem = ({ title, value, unit }: { title: string; value: number; unit: string }) => (
    <View style={[styles.statCard, { 
      backgroundColor: theme.card,
      borderColor: theme.cardBorder,
    }]}>
      <Text style={[styles.statValue, { color: theme.text }]}>{value.toFixed(1)} {unit}</Text>
      <Text style={[styles.statTitle, { color: theme.textSecondary }]}>{title}</Text>
    </View>
  );

  const HealthBenefitCard = ({ benefit }: { benefit: HealthBenefit }) => {
    const [isAchieved, setIsAchieved] = useState(false);

    useEffect(() => {
      if (quitDate) {
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - quitDate.getTime()) / (1000 * 60));
        
        setIsAchieved(diffMinutes >= benefit.timeInMinutes);
      }
    }, [quitDate, benefit.timeInMinutes]);

    const formatTimeRemaining = (minutes: number): string => {
      const days = Math.floor(minutes / 1440);
      const hours = Math.floor((minutes % 1440) / 60);
      const mins = Math.floor(minutes % 60);

      if (days > 0) {
        return `${days} ${t('stats.time.days')} ${hours} ${t('stats.time.hours')}`;
      } else if (hours > 0) {
        return `${hours} ${t('stats.time.hours')} ${mins} ${t('stats.time.minutes')}`;
      } else {
        return `${mins} ${t('stats.time.minutes')}`;
      }
    };

    return (
      <View style={[styles.healthCard, {
        backgroundColor: theme.card,
        borderColor: isAchieved ? SUCCESS_COLOR : theme.cardBorder,
      }]}>
        <View style={styles.healthCardInner}>
          <View style={[styles.iconContainer, { 
            backgroundColor: isAchieved ? SUCCESS_COLOR + '20' : theme.cardBorder + '40'
          }]}>
            <Ionicons name={benefit.icon as any} size={24} color={isAchieved ? SUCCESS_COLOR : theme.text} />
          </View>
          <View style={styles.benefitContent}>
            <Text style={[styles.benefitTitle, { color: theme.text }]} numberOfLines={1}>
              {t(getBenefitTranslationKey(benefit.id, 'title'))}
            </Text>
            <Text style={[styles.benefitDescription, { color: theme.textSecondary }]} numberOfLines={2}>
              {t(getBenefitTranslationKey(benefit.id, 'description'))}
            </Text>
            {isAchieved ? (
              <Text style={[styles.benefitTime, { color: SUCCESS_COLOR }]} numberOfLines={1}>
                <Ionicons name="checkmark" size={20} color={SUCCESS_COLOR} />
              </Text>
            ) : (
              <Text style={[styles.benefitTime, { color: theme.primary }]} numberOfLines={1}>
                {formatTimeRemaining(benefit.timeInMinutes)}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderHealthBenefits = () => {
    const rows = [];
    for (let i = 0; i < healthBenefits.length; i += 2) {
      rows.push(
        <View key={i} style={styles.healthCardRow}>
          <View style={styles.healthCardColumn}>
            <HealthBenefitCard benefit={healthBenefits[i]} />
          </View>
          {healthBenefits[i + 1] && (
            <View style={styles.healthCardColumn}>
              <HealthBenefitCard benefit={healthBenefits[i + 1]} />
            </View>
          )}
        </View>
      );
    }
    return rows;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{t('stats.title')}</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {t('stats.subtitle')}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <StatItem
          title={t('stats.moneySaved')}
          value={stats.moneySaved}
          unit="TL"
        />
        <StatItem
          title={t('stats.cigarettesNotSmoked')}
          value={stats.cigarettesNotSmoked}
          unit="adet"
        />
        <StatItem
          title={t('stats.timeRegained')}
          value={stats.timeRegained}
          unit="saat"
        />
        <StatItem
          title={t('stats.daysSince')}
          value={stats.daysSince}
          unit="gün"
        />
      </View>

      <View style={[styles.healthSection, { backgroundColor: theme.background }]}>
        <Text style={[styles.healthTitle, { color: theme.text }]}>{t('stats.benefits.title')}</Text>
        <Text style={[styles.healthSubtitle, { color: theme.textSecondary }]}>
          {t('stats.benefits.subtitle')}
        </Text>
        <View style={styles.healthCardsContainer}>
          {renderHealthBenefits()}
        </View>
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
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  statCard: {
    width: '45%',
    padding: 15,
    marginBottom: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
  },
  statTitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  healthSection: {
    padding: 20,
  },
  healthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  healthSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  healthCardsContainer: {
    gap: 15,
  },
  healthCardRow: {
    flexDirection: 'row',
    gap: 15,
    paddingHorizontal: 2,
  },
  healthCardColumn: {
    flex: 1,
  },
  healthCard: {
    borderRadius: 12,
    borderWidth: 1,
    height: 180,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  healthCardInner: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitContent: {
    width: '100%',
    alignItems: 'center',
    gap: 4,
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  benefitTime: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  benefitDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
