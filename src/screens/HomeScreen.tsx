import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../services/storage';

export const HomeScreen = () => {
  const [quitDate, setQuitDate] = useState<Date | null>(null);
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

  const MINUTES_PER_CIGARETTE = 10;

  useEffect(() => {
    loadData();
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

  const handleStartQuitting = async () => {
    const date = new Date();
    setQuitDate(date);
    await storage.saveQuitDate(date);
  };

  const Achievement = ({ icon, title, value, unit }: { icon: string, title: string, value: number, unit: string }) => (
    <View style={styles.achievementCard}>
      <Ionicons name={icon as any} size={32} color="#2C3E50" />
      <Text style={styles.achievementTitle}>{title}</Text>
      <Text style={styles.achievementValue}>{value.toFixed(1)} {unit}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {!quitDate ? (
        <View style={styles.welcomeContainer}>
          <Text style={styles.title}>Sigarasız Hayata Hoş Geldiniz!</Text>
          <Text style={styles.subtitle}>Yeni bir başlangıç için hazır mısınız?</Text>
          <TouchableOpacity style={styles.startButton} onPress={handleStartQuitting}>
            <Text style={styles.startButtonText}>Sigarayı Bırakmaya Başla</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Başarılarınız</Text>
            <Text style={styles.subtitle}>{stats.daysSince} gündür sigarasızsınız!</Text>
          </View>
          
          <View style={styles.achievementsContainer}>
            <Achievement 
              icon="time-outline" 
              title="Kazanılan Zaman" 
              value={stats.timeRegained} 
              unit="saat"
            />
            <Achievement 
              icon="cash-outline" 
              title="Biriken Para" 
              value={stats.moneySaved} 
              unit="TL"
            />
            <Achievement 
              icon="medical-outline" 
              title="İçilmeyen Sigara" 
              value={stats.cigarettesNotSmoked} 
              unit="adet"
            />
          </View>

          <View style={styles.motivationCard}>
            <Ionicons name="trophy" size={40} color="#FFD700" />
            <Text style={styles.motivationText}>
              Harika gidiyorsunuz! Her gün daha sağlıklı bir yaşama bir adım daha yakınsınız.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#2C3E50',
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
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  achievementCard: {
    backgroundColor: '#f5f6fa',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    width: '45%',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  achievementTitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 8,
    textAlign: 'center',
  },
  achievementValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 4,
  },
  motivationCard: {
    backgroundColor: '#f5f6fa',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  motivationText: {
    fontSize: 16,
    color: '#2C3E50',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 24,
  },
});
