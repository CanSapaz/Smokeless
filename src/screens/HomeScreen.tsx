import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../services/storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import type { TranslationPath } from '../hooks/useTranslation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Motivasyon sözleri
const motivationalQuotes = [
  "Her yeni gün, daha sağlıklı bir yaşam için yeni bir fırsat!",
  "Küçük adımlar, büyük değişimlere yol açar.",
  "Kendine olan inancını asla kaybetme!",
  "Bugün zorlu olabilir, ama yarın daha güçlü olacaksın.",
  "Her 'Hayır' dediğinde, özgürlüğüne 'Evet' demiş oluyorsun.",
  "Sağlıklı bir gelecek için doğru yoldasın!",
  "Başarı, her gün alınan küçük kararların toplamıdır.",
  "Sen seçimlerinden daha güçlüsün!",
];

// Günlük görevler
type TaskId = 'water' | 'breathing' | 'walk' | 'fruit';

interface Task {
  id: number;
  taskType: TaskId;
  icon: string;
}

const dailyTasks: Task[] = [
  {
    id: 1,
    taskType: 'water',
    icon: "water-outline",
  },
  {
    id: 2,
    taskType: 'breathing',
    icon: "leaf-outline",
  },
  {
    id: 3,
    taskType: 'walk',
    icon: "walk-outline",
  },
  {
    id: 4,
    taskType: 'fruit',
    icon: "nutrition-outline",
  },
];

// Başa çıkma teknikleri
type CopingTechniqueId = 'breathing' | 'walking' | 'water' | 'distraction';

interface CopingTechnique {
  id: CopingTechniqueId;
  icon: string;
}

const copingTechniques: CopingTechnique[] = [
  {
    id: 'breathing',
    icon: "fitness-outline",
  },
  {
    id: 'water',
    icon: "water-outline",
  },
  {
    id: 'walking',
    icon: "walk-outline",
  },
  {
    id: 'distraction',
    icon: "game-controller-outline",
  },
];

type StatKey = 'moneySaved' | 'cigarettesNotSmoked' | 'daysSince' | 'timeRegained';

export const HomeScreen = () => {
  const [quitDate, setQuitDate] = useState<Date | null>(null);
  const [dailyQuote, setDailyQuote] = useState("");
  const [profile, setProfile] = useState({
    cigarettesPerDay: 20,
    pricePerPack: 30,
    cigarettesPerPack: 20,
  });
  const [stats, setStats] = useState({
    daysSince: 0,
    moneySaved: 0,
    cigarettesNotSmoked: 0,
    timeRegained: 0,
  });
  const [mood, setMood] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const MINUTES_PER_CIGARETTE = 10;

  const getCopingTranslationKey = (id: CopingTechniqueId, key: 'title' | 'description'): TranslationPath => {
    return `home.coping.${id}.${key}` as const;
  };

  const getTaskTranslationKey = (taskType: TaskId, key: 'title' | 'description'): TranslationPath => {
    return `home.tasks.${taskType}.${key}` as const;
  };

  const getStatTranslationKey = (key: StatKey): TranslationPath => {
    return (`home.stats.${key}`) as const;
  };

  const getQuotesTranslationKey = (): TranslationPath => {
    return 'home.quotes' as TranslationPath;
  };

  const getTasksTitleTranslationKey = (): TranslationPath => {
    return 'home.tasks.title' as TranslationPath;
  };

  const getCopingTitleTranslationKey = (): TranslationPath => {
    return 'home.coping.title' as TranslationPath;
  };

  const getQuotes = (): string[] => {
    return t(getQuotesTranslationKey()) as unknown as string[];
  };

  useEffect(() => {
    loadData();
    setRandomQuote();
  }, []);

  const loadData = async () => {
    const savedQuitDate = await storage.getQuitDate();
    const savedProfile = await storage.getUserProfile();
    
    if (savedQuitDate) {
      setQuitDate(savedQuitDate);
    }
    
    if (savedProfile) {
      setProfile(savedProfile);
    }
  };

  useEffect(() => {
    if (quitDate) {
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - quitDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setStats({
        daysSince: diffDays,
        moneySaved: (diffDays * (profile.cigarettesPerDay / profile.cigarettesPerPack) * profile.pricePerPack),
        cigarettesNotSmoked: diffDays * profile.cigarettesPerDay,
        timeRegained: (diffDays * profile.cigarettesPerDay * MINUTES_PER_CIGARETTE) / 60,
      });
    }
  }, [quitDate, profile]);

  const setRandomQuote = () => {
    const quotes = getQuotes();
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setDailyQuote(quotes[randomIndex]);
  };

  const handleStartQuitting = async () => {
    const date = new Date();
    setQuitDate(date);
    await storage.saveQuitDate(date);
  };

  const toggleTask = (taskId: number) => {
    setCompletedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleMoodSelect = (selectedMood: string) => {
    setMood(selectedMood);
    // Burada mood'u storage'a kaydedebiliriz
  };

  const StatCard = ({ icon, value, unit, decimal = true, title }: { 
    icon: string, 
    value: number, 
    unit: string,
    decimal?: boolean,
    title: TranslationPath
  }) => (
    <View style={[styles.statCard, {
      backgroundColor: theme.card,
      borderColor: theme.cardBorder,
    }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon as any} size={24} color={theme.primary} />
        <Text style={[styles.statTitle, { color: theme.textSecondary }]}>{t(title)}</Text>
      </View>
      <View style={styles.statValueContainer}>
        <Text style={[styles.statValue, { color: theme.text }]}>
          {decimal ? value.toFixed(1) : Math.round(value)} {unit}
        </Text>
      </View>
    </View>
  );

  const TaskCard = ({ task }: { task: Task }) => {
    const SUCCESS_COLOR = '#4CAF50'; // Başarı yeşili
    const isCompleted = completedTasks.includes(task.id);

    return (
      <TouchableOpacity
        style={[styles.taskCard, {
          backgroundColor: theme.card,
          borderColor: isCompleted ? SUCCESS_COLOR : theme.cardBorder,
        }]}
        onPress={() => toggleTask(task.id)}
      >
        <View style={styles.taskContent}>
          <View style={[styles.taskIconContainer, { 
            backgroundColor: isCompleted ? SUCCESS_COLOR + '20' : theme.cardBorder + '40'
          }]}>
            <Ionicons 
              name={task.icon as any} 
              size={24} 
              color={isCompleted ? SUCCESS_COLOR : theme.text} 
            />
          </View>
          <View style={styles.taskTextContainer}>
            <Text style={[styles.taskTitle, { color: theme.text }]}>
              {t(getTaskTranslationKey(task.taskType, 'title'))}
            </Text>
            <Text style={[styles.taskDescription, { color: theme.textSecondary }]}>
              {t(getTaskTranslationKey(task.taskType, 'description'))}
            </Text>
          </View>
          {isCompleted ? (
            <Ionicons name="checkmark" size={24} color={SUCCESS_COLOR} />
          ) : (
            <View style={[styles.checkbox, { borderColor: theme.textSecondary }]} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const CopingCard = ({ technique }: { technique: CopingTechnique }) => (
    <View style={[styles.copingCard, {
      backgroundColor: theme.card,
      borderColor: theme.cardBorder,
    }]}>
      <View style={[styles.copingIconContainer, { backgroundColor: theme.primary + '20' }]}>
        <Ionicons name={technique.icon as any} size={24} color={theme.primary} />
      </View>
      <Text style={[styles.copingTitle, { color: theme.text }]}>
        {t(getCopingTranslationKey(technique.id, 'title'))}
      </Text>
      <Text style={[styles.copingDescription, { color: theme.textSecondary }]}>
        {t(getCopingTranslationKey(technique.id, 'description'))}
      </Text>
    </View>
  );

  if (!quitDate) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.welcomeContainer}>
          <Text style={[styles.title, { color: theme.text }]}>{t('home.welcome.title' as const)}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{t('home.welcome.subtitle' as const)}</Text>
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: theme.primary }]}
            onPress={handleStartQuitting}
          >
            <Text style={styles.startButtonText}>{t('home.startQuitting' as const)}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Hoşgeldin ve İstatistikler */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('home.welcomeBack' as const)}</Text>
        <View style={styles.statsContainer}>
          <StatCard
            icon="cash-outline"
            value={stats.moneySaved}
            unit="₺"
            decimal={true}
            title={getStatTranslationKey('moneySaved')}
          />
          <StatCard
            icon="medical-outline"
            value={stats.cigarettesNotSmoked}
            unit=""
            decimal={false}
            title={getStatTranslationKey('cigarettesNotSmoked')}
          />
          <StatCard
            icon="calendar-outline"
            value={stats.daysSince}
            unit=""
            decimal={false}
            title={getStatTranslationKey('daysSince')}
          />
        </View>
      </View>

      {/* Motivasyon Kartı */}
      <View style={[styles.quoteCard, {
        backgroundColor: theme.card,
        borderColor: theme.cardBorder,
      }]}>
        <View style={[styles.quoteIconContainer, { backgroundColor: theme.primary + '20' }]}>
          <Ionicons name="sunny" size={32} color={theme.primary} />
        </View>
        <Text style={[styles.quoteText, { color: theme.text }]}>{dailyQuote}</Text>
      </View>

      {/* Günlük Görevler */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t(getTasksTitleTranslationKey())}
        </Text>
        <View style={styles.tasksContainer}>
          {dailyTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </View>
      </View>

      {/* Başa Çıkma Teknikleri */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t(getCopingTitleTranslationKey())}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.copingContainer}
        >
          {copingTechniques.map(technique => (
            <CopingCard key={technique.id} technique={technique} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  quoteCard: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  quoteIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  quoteText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  statCard: {
    flex: 1,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statTitle: {
    fontSize: 14,
  },
  statValueContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tasksContainer: {
    gap: 10,
  },
  taskCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 12,
  },
  copingContainer: {
    paddingHorizontal: 5,
    gap: 15,
  },
  copingCard: {
    width: 200,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  copingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  copingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  copingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
