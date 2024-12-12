import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../services/storage';
import { useTheme } from '../context/ThemeContext';

interface HealthBenefit {
  title: string;
  time: string;
  description: string;
  icon: string;
}

const healthBenefits: HealthBenefit[] = [
  {
    title: 'İlk Adım',
    time: '20 dakika sonra',
    description: 'Kan basıncı ve nabız normale döndü',
    icon: 'heart-outline'
  },
  {
    title: 'Temiz Kan',
    time: '8 saat sonra',
    description: 'Kandaki karbon monoksit seviyesi normale döndü',
    icon: 'water-outline'
  },
  {
    title: 'Güçlü Kalp',
    time: '24 saat sonra',
    description: 'Kalp krizi riski azalmaya başladı',
    icon: 'fitness-outline'
  },
  {
    title: 'Yeni Duygular',
    time: '48 saat sonra',
    description: 'Tat ve koku duyuları gelişmeye başladı',
    icon: 'restaurant-outline'
  },
  {
    title: 'Temiz Nefes',
    time: '72 saat sonra',
    description: 'Nefes alma kolaylaştı',
    icon: 'leaf-outline'
  },
  {
    title: 'Rahat Akciğer',
    time: '1-9 ay sonra',
    description: 'Öksürük ve nefes darlığı azaldı',
    icon: 'medkit-outline'
  },
  {
    title: 'Sağlıklı Yaşam',
    time: '1 yıl sonra',
    description: 'Kalp krizi riski yarıya indi',
    icon: 'pulse-outline'
  },
  {
    title: 'Yeni Ben',
    time: '5 yıl sonra',
    description: 'Akciğer kanseri riski yarıya indi',
    icon: 'shield-checkmark-outline'
  }
];

export const StatsScreen = () => {
  const [stats, setStats] = useState({
    daysSince: 0,
    moneySaved: 0,
    cigarettesNotSmoked: 0,
    timeRegained: 0,
  });
  const [quitDate, setQuitDate] = useState<Date | null>(null);

  const { theme } = useTheme();
  const MINUTES_PER_CIGARETTE = 10;

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
    const SUCCESS_COLOR = '#4CAF50'; // Başarı yeşili

    useEffect(() => {
      if (quitDate) {
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - quitDate.getTime()) / (1000 * 60));
        
        // Zamanı dakikaya çevir
        const timeValue = benefit.time.split(' ')[0];
        const timeUnit = benefit.time.split(' ')[1];
        let targetMinutes = parseInt(timeValue);
        
        // Birimi dakikaya çevir
        switch (timeUnit) {
          case 'saat':
            targetMinutes *= 60;
            break;
          case 'gün':
            targetMinutes *= 24 * 60;
            break;
          case 'hafta':
            targetMinutes *= 7 * 24 * 60;
            break;
          case 'ay':
            targetMinutes *= 30 * 24 * 60;
            break;
          case 'yıl':
            targetMinutes *= 365 * 24 * 60;
            break;
        }

        setIsAchieved(diffMinutes >= targetMinutes);
      }
    }, [quitDate, benefit.time]);

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
              {benefit.title}
            </Text>
            {isAchieved ? (
              <Text style={[styles.benefitTime, { color: SUCCESS_COLOR }]} numberOfLines={1}>
                <Ionicons name="checkmark" size={20} color={SUCCESS_COLOR} />
              </Text>
            ) : (
              <Text style={[styles.benefitTime, { color: theme.primary }]} numberOfLines={1}>
                {benefit.time}
              </Text>
            )}
            <Text style={[styles.benefitDescription, { color: theme.textSecondary }]} numberOfLines={2}>
              {benefit.description}
            </Text>
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
        <Text style={[styles.title, { color: theme.text }]}>İstatistikler</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Sigarasız geçen {stats.daysSince} gün boyunca elde ettiğiniz kazanımlar
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <StatItem
          title="Biriken Para"
          value={stats.moneySaved}
          unit="TL"
        />
        <StatItem
          title="İçilmeyen Sigara"
          value={stats.cigarettesNotSmoked}
          unit="adet"
        />
        <StatItem
          title="Kazanılan Zaman"
          value={stats.timeRegained}
          unit="saat"
        />
        <StatItem
          title="Sigarasız Günler"
          value={stats.daysSince}
          unit="gün"
        />
      </View>

      <View style={[styles.healthSection, { backgroundColor: theme.background }]}>
        <Text style={[styles.healthTitle, { color: theme.text }]}>Sağlık Kazanımları</Text>
        <Text style={[styles.healthSubtitle, { color: theme.textSecondary }]}>
          Sigarayı bıraktıktan sonra vücudunuzda gerçekleşen olumlu değişimler
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
